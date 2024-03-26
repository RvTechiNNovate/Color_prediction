import asyncio
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import random
from datetime import datetime


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

remaining_time = 0
websockets = set()
duration = 60


url= "http://localhost:5000"

class GameResult(BaseModel):
    sizes: str
    timestamp: str
    color: str
    number: str


async def update_timer():
    count=0
    global remaining_time
    try:
        while True:

            if remaining_time > 0:
                remaining_time -= 1
            if remaining_time == 0:
                print("Timer expired!")
                colors = ["red", "green", "violet"]
                sizes = ['Big', 'Small']
                random_color = random.choice(colors)
                random_size = random.choice(sizes)
                random_number = random.randint(0, 9)
                current_timestamp = datetime.now().strftime("%y%m%d%H%M")
                count+=1

                handle_result_save(
                    {
                        "timestamp": current_timestamp+str(count).zfill(3),
                        'sizes': random_size,
                        "color": random_color,
                        "number": random_number,
                    }
                )
                remaining_time = duration

            for ws in websockets.copy():
                try:
                    await ws.send_text(str(remaining_time))
                except WebSocketDisconnect:
                    websockets.remove(ws)
            await asyncio.sleep(1)

    except Exception as e:
        print(f"Timer update error: {e}")
        asyncio.create_task(update_timer())


def handle_result_save(result_data):

    print("Handling and saving result:", result_data)
    import requests
    api_url = f"{url}/game_result"
    response = requests.post(api_url, json=result_data)

    # Check the response
    if response.status_code == 200:
        print("Game result stored successfully")
    else:
        print(f"Failed to store game result. Status code: {response.status_code}")
        print(response.text)



@app.on_event("startup")
async def startup_event():
    global remaining_time
    remaining_time = duration
    asyncio.create_task(update_timer())


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    websockets.add(ws)
    try:
        while True:
            data = await ws.receive_text()
            if data == "update":
                await ws.send_text(str(remaining_time))
    except WebSocketDisconnect:
        websockets.remove(ws)
    except Exception as e:
        print(f"WebSocket error: {e}")
        websockets.remove(ws)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000,)
