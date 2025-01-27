import threading
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from game_engine import GameEngine

app = FastAPI(title="Game Api")
game = GameEngine()  # Create an instance of the GameEngine
input_queue = asyncio.Queue()  # Async queue for inputs


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection opened!")
    start_time = asyncio.get_event_loop().time()  # Record the start time

    try:
        while True:
            # Calculate the number of seconds since the connection was opened
            # elapsed_time = int(asyncio.get_event_loop().time() - start_time)
            # await websocket.send_text(str(elapsed_time))  # Send the elapsed time
            data = game.game_state

            # Send the list as JSON
            await websocket.send_json(data)

            await asyncio.sleep(1 / 30)  # Wait for ~33ms to achieve 30 FPS
    except WebSocketDisconnect:
        print("WebSocket disconnected!")
    except Exception as e:
        print(f"WebSocket error: {e}")


# Game Input Handling Loop
async def handle_inputs():
    while game.running:
        while not input_queue.empty():
            action = await input_queue.get()
            game.handle_input(action)
        await asyncio.sleep(0.05)


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
