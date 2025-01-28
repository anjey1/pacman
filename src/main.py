import threading
import asyncio
import json
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
            data = json.loads(await websocket.receive_text())
            direction = data["arrow"]
            print(f"Received direction: {direction}")

            # if event.type == pygame.QUIT:
            #     self.running = False
            # elif event.type == pygame.KEYDOWN:
            #     if event.key == pygame.K_ESCAPE:
            #         self.running = False
            if direction == "arrowup":
                game.direction = "UP"
            elif direction == "arrowdown":
                game.direction = "DOWN"
            elif direction == "arrowleft":
                game.direction = "LEFT"
            elif direction == "arrowright":
                game.direction = "RIGHT"

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
