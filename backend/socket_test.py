from fastapi import FastAPI, WebSocket
import sqlite3

app = FastAPI()




class Database:
    def __init__(self, db_name):
        self.db_name = db_name

    def get_data(self):
        # Example function to get data from the database
        print("hi i am here in get data")

    def update_data(self, data):
       print("i am here in update data",data)

    def delete_data(self, id):
        print("hi i am in delete data",id)


# Initialize database instance
database = Database("teddst.db")

# WebSocket Connection Manager
class WebSocketManager:
    def __init__(self):
        self.active_connections = set()

    async def connect(self, websocket: WebSocket):
        print("client is connected to server ")
        await websocket.accept()
        self.active_connections.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        print("client is disconnected to server ")
        await websocket.close()
        self.active_connections.remove(websocket)


manager = WebSocketManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages and execute corresponding CRUD operations
            if data == 'get_data':
                print("i am in get data")

                await websocket.send_json({"hi":'1'})
            elif data.startswith('update_data'):
                # Example: Update data in the database based on received message
                

                # database.update_data(data_to_update)
                await websocket.send_text('Data updated successfully')
            elif data.startswith('delete_data'):
                # Example: Delete data from the database based on received message
                
                # database.delete_data(data_to_delete)
                await websocket.send_text('Data deleted successfully')
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        await manager.disconnect(websocket)


    

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9000,)

