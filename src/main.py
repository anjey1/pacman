import threading
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from game_engine import GameEngine

app = FastAPI(title="Game Api")
game = GameEngine()  # Create an instance of the GameEngine
arrow_queue = asyncio.Queue()  # Async queue for inputs


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection opened!")
    start_time = asyncio.get_event_loop().time()  # Record the start time

    try:
        while True:
            data = game.game_state

            # Check if there is any new arrow key press
            if not arrow_queue.empty():
                direction = await arrow_queue.get()  # Get direction from queue
                # Update game state based on direction here (if needed)

            # Send the list as JSON
            await websocket.send_json(data)

            await asyncio.sleep(1 / 40)  # Wait for ~33ms to achieve 30 FPS
    except WebSocketDisconnect:
        print("WebSocket disconnected!")
    except Exception as e:
        print(f"WebSocket error: {e}")


# Route to handle arrow key press data
@app.websocket("/ws/arrow")
async def arrow_key_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket for arrow keys connected!")

    try:
        while True:
            direction = await websocket.receive_text()  # Receive message from client
            print(f"Received direction from client: {direction}")

            # Update the arrow queue with the new direction
            # Put the received arrow direction in the queue
            await arrow_queue.put(direction)

            # Optional: You could send a confirmation back to the client
            await websocket.send_text(f"Direction {direction} received")
            await asyncio.sleep(1 / 30)
    except WebSocketDisconnect:
        print("Arrow key WebSocket disconnected!")
    except Exception as e:
        print(f"WebSocket error: {e}")


# Run the Pygame loop in a separate thread
def start_game():
    game.run()


# Run everything
def main():
    # Start the Pygame loop in a separate thread
    threading.Thread(target=start_game, daemon=True).start()
    print("Pygame started...")

    # Start the FastAPI server
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
