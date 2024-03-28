from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import sqlite3
import base64
from typing import Optional  

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add specific origins as needed
    allow_credentials=True,
    allow_methods=["*"],  # Add specific methods as needed
    allow_headers=["*"],  # Add specific headers as needed
)


class Database:
    def __init__(self, db_name):
        print("db name initialized")
        self.db_name = db_name

    def __enter__(self):
        print("enter in db")
        self.conn = sqlite3.connect(self.db_name)
        self.conn.execute("BEGIN")
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("db exits")
        if exc_type is None:
            self.conn.commit()
        else:
            self.conn.rollback()
        self.conn.close()


db_name = (
    r"C:/A_Local_disk_D/POC/Game_poc/colorfantasy/backend/color_prediction_game.db"
)


class UserRegistration(BaseModel):
    user_id: str
    username: str
    password: str
    email: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserID(BaseModel):
    user_id: str


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = ""
    date_of_birth: Optional[str] = ""
    address: Optional[str] = ""
    phone_number: Optional[str] = ""


class Transaction(BaseModel):
    amount: int

class Order(BaseModel):
    color_prediction: str
    quantity: str

class GameResult(BaseModel):
    timestamp: str
    sizes: str
    color: str
    number: str

class DepositRequest(BaseModel):
    reference_id: str
    amount: int


def execute_query(query: str, params: tuple = ()):
    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor


@app.post("/register")
def register(user: UserRegistration):
    query = "INSERT INTO User (user_id, username, password, email, balance) VALUES (?, ?, ?, ?, ?)"
    execute_query(query, (user.user_id, user.username, user.password, user.email, 0))
    query = "INSERT INTO Profile (user_id, full_name, date_of_birth, address, phone_number) VALUES (?, ?, ?, ?, ?)"
    execute_query(query, (user.user_id, user.username, "", "", ""))
    return {"message": "User registered successfully"}


@app.post('/balance')
def balance(user: UserID):
    query = 'SELECT balance FROM User WHERE user_id = ?'
    result = execute_query(query, (user.user_id,)).fetchone()
    if result:
        return {'balance': result[0], 'message': 'Login successful'}
    else:
        raise HTTPException(status_code=401, detail='Invalid user ID')



@app.post("/login")
def login(user: UserID):
    print("i am here login")

    with Database(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM User WHERE user_id = ?", (user.user_id,))
        user_data = cursor.fetchone()
        print(user_data)
        if user_data:
            return {"data": user_data, "message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")


@app.put("/profile/{user_id}")
def update_or_insert_profile(user_id: str, profile: UserProfileUpdate):
    with Database(db_name) as conn:
        cursor = conn.cursor()

        # Check if the profile exists
        cursor.execute("SELECT 1 FROM Profile WHERE user_id=?", (user_id,))
        existing_profile = cursor.fetchone()
        print(existing_profile)

        if existing_profile:
            # Update the existing profile
            cursor.execute(
                "UPDATE Profile SET full_name=?, date_of_birth=?, address=?, phone_number=? WHERE user_id=?",
                (
                    profile.full_name,
                    profile.date_of_birth,
                    profile.address,
                    profile.phone_number,
                    user_id,
                ),
            )
        else:
            # Insert a new profile
            cursor.execute(
                "INSERT INTO Profile (user_id, full_name, date_of_birth, address, phone_number) VALUES (?, ?, ?, ?, ?)",
                (
                    user_id,
                    profile.full_name,
                    profile.date_of_birth,
                    profile.address,
                    profile.phone_number,
                ),
            )
    return {"message": "Profile updated or inserted successfully"}


@app.get("/profile/{user_id}")
def get_profile(user_id: str):
    with Database(db_name) as conn:
        cursor = conn.cursor()
        # Check if the profile exists
        print(user_id)
        cursor.execute(
            "SELECT user_id,full_name,date_of_birth,address,phone_number FROM Profile WHERE user_id=?",
            (user_id,),
        )
        existing_profile = cursor.fetchone()

        print(existing_profile)
        if existing_profile:
            # Convert the result to a dictionary for a more structured response
            profile_data = {
                "full_name": existing_profile[1],
                "dob": existing_profile[2],
                "address": existing_profile[3],
                "phone_number": existing_profile[4],
            }
            return JSONResponse(
                content={
                    "data": profile_data,
                    "message": "Profile fetched successfully",
                }
            )
        else:
            # Handle the case where the profile does not exist
            raise HTTPException(
                status_code=404, detail="Profile not found for the specified user_id"
            )


@app.post("/deposit/{user_id}")
def deposit(user_id: str, transaction: Transaction):
    print("i am here deposit")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE User SET balance = balance + ? WHERE user_id = ?",
            (transaction.amount, user_id),
        )
    return {"message": "Deposit successful"}


@app.post("/deposit_request_status_update/{ref_id}/{flag}")
async def deposit_request_status_update(ref_id: str, flag: int):
    print(ref_id)

    print("i am here deposit request_image")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        # UPDATE User SET balance = balance + ? WHERE user_id = ?'
        cursor.execute(
            "UPDATE DepositRequests SET status = ? WHERE depositRequest=?",
            (flag, ref_id),
        )
    return {"message": "Approval update Successful"}


class DepositRequestCreate(BaseModel):
    amount: float
    reference_id: str
    image_data: list[int]


@app.get("/deposit_request/")
async def deposit_request():
    try:
        print("I am here deposit request get")
        with Database(db_name) as conn:
            cursor = conn.cursor()

            cursor.execute(
                "SELECT depositRequest, user_id, reference_id, amount, data, status FROM DepositRequests ORDER BY status"
            )
            result = cursor.fetchall()

            data_list = []
            if result:
                for row in result:
                    deposit_request, user_id, reference_id, amount, data, status = row
                    print(deposit_request, user_id, reference_id, amount, status)

                    # Check if data is binary and encode to base64
                    if isinstance(data, bytes):
                        data_base64 = base64.b64encode(data).decode("utf-8")
                    else:
                        data_base64 = data

                    data_list.append(
                        {
                            "depositRequest": deposit_request,
                            "user_id": user_id,
                            "reference_id": reference_id,
                            "amount": amount,
                            "data": data_base64,
                            "status": status,
                        }
                    )

            return JSONResponse(
                content={"data": data_list, "message": "Data fetched successfully"}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/deposit_request/{user_id}")
async def deposit_request(user_id: str, request: DepositRequestCreate):
    print(user_id, request.amount, request.reference_id)
    image_bytes = bytes(request.image_data)

    print("i am here deposit request")
    with Database(db_name) as conn:
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO DepositRequests (user_id, reference_id, amount,data) VALUES (?, ?, ?,?)",
            (user_id, request.reference_id, request.amount, image_bytes),
        )
    return {"message": "Deposit Request Successful33"}


@app.post("/withdraw/{user_id}")
def withdraw(user_id: str, transaction: Transaction):
    print("i am here withdraw request")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT balance FROM User WHERE user_id = ?", (user_id,))
        balance = cursor.fetchone()["balance"]
        if balance >= transaction.amount:
            cursor.execute(
                "UPDATE User SET balance = balance - ? WHERE user_id = ?",
                (transaction.amount, user_id),
            )
            return {"message": "Withdrawal request successful"}
        else:
            raise HTTPException(status_code=400, detail="Insufficient balance")


@app.get("/order/{user_id}")
def get_order(user_id: str):
    print("i am here get order  details")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        print("i am here in get order data")
        cursor.execute(
            "SELECT * FROM Orders WHERE user_id = ? AND status = ?", (user_id, 0)
        )
        user_data = cursor.fetchone()
    if user_data:
        return {
            "data": user_data,
            "message": "Order fetched successfully",
        }
    return {
        "data": [],
        "message": "No order Found",
    }


@app.put("/orderstatus/{user_id}")
def place_order(user_id: str):
    print("i am here order status update")
    with Database(db_name) as conn:
        cursor = conn.cursor()

        cursor.execute("UPDATE Orders SET status = ? WHERE user_id = ?", (1, user_id))

    return {
        "message": "status updated successfully",
    }


@app.post("/order/{user_id}")
def place_order(user_id: str, order: Order):
    print("i am here order")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        print("i am here")
        cursor.execute(
            "INSERT INTO Orders (user_id, color_prediction, quantity,status) VALUES (?, ?, ?,?)",
            (user_id, order.color_prediction, order.quantity, 0),
        )

        cursor.execute("SELECT balance FROM User WHERE user_id = ?", (user_id,))
        user_data = cursor.fetchone()
        print(user_data)
        new_balance = user_data[0] - float(order.quantity)
        cursor.execute(
            "UPDATE User SET balance = ? WHERE user_id = ?", (new_balance, user_id)
        )

    return {
        "balance": new_balance,
        "message": "Order placed successfully",
    }


@app.post("/game_result")
def store_game_result(result: GameResult):
    print("i am here post game result")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO GameResult (timestamp,sizes,color,number) VALUES (?, ?,?,?)",
            (result.timestamp, result.sizes, result.color, result.number),
        )
    return {"message": "Game result stored successfully"}


from typing import Optional


@app.get("/game_result")
def get_game_result(skip: Optional[int] = 0, limit: Optional[int] = 10):
    print("i am here get game result")
    with Database(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM GameResult ORDER BY result_id DESC LIMIT ? OFFSET ?",
            (limit, skip),
        )
        result = cursor.fetchall()
        if result:
            return {"Results": result}
        else:
            print(" i am here !!!!")
            raise HTTPException(status_code=404, detail="No Game result found ")


@app.get("/transactions/{user_id}")
def get_transactions(user_id: str):
    print("i am here transaction")

    with Database(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Transactions WHERE user_id = ?", (user_id,))
        transactions = cursor.fetchall()
        if transactions:
            return {"transactions": transactions}
        else:
            raise HTTPException(
                status_code=404, detail="No transactions found for the user"
            )


def rename_column(table_name, old_column_name, new_column_name):
    with Database(db_name) as conn:
        cursor = conn.cursor()

        # Check if the old column exists in the table
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()

        old_column_exists = any(old_column_name == column[1] for column in columns)

        if old_column_exists:
            # Rename the old column to the new name
            cursor.execute(
                f"ALTER TABLE {table_name} RENAME COLUMN {old_column_name} TO {new_column_name}"
            )


# rename_column('DepositRequests', 'data', 'images')


# def create_tables():
#     with Database(db_name) as conn:
#         cursor = conn.cursor()

        # cursor.execute('''
        #     CREATE TABLE IF NOT EXISTS User (
        #         user_id TEXT PRIMARY KEY,
        #         username TEXT NOT NULL,
        #         password TEXT NOT NULL,
        #         email TEXT NOT NULL,
        #         balance REAL NOT NULL
        #     );
        # ''')

        # cursor.execute('''
        #     CREATE TABLE IF NOT EXISTS Profile (
        #         user_id TEXT PRIMARY KEY,
        #         full_name TEXT NOT NULL,
        #         date_of_birth TEXT NOT NULL,
        #         address TEXT NOT NULL,
        #         phone_number TEXT NOT NULL,
        #         FOREIGN KEY (user_id) REFERENCES User (user_id)
        #     );
        # ''')

        # cursor.execute('''
        #     CREATE TABLE IF NOT EXISTS Orders (
        #         order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        #         user_id TEXT NOT NULL,
        #         color_prediction TEXT NOT NULL,
        #         quantity TEXT NOT NULL,
        #         FOREIGN KEY (user_id) REFERENCES User (user_id)
        #     );
        # ''')

        # cursor.execute('''
        # CREATE TABLE IF NOT EXISTS GameResult (
        #     result_id INTEGER PRIMARY KEY AUTOINCREMENT,
        #     timestamp TEXT NOT NULL,
        #     number REAL NOT NULL,
        #     sizes TEXT NOT NULL,
        #     color TEXT NOT NULL
        # );
        # ''')

        # cursor.execute('''
        #     CREATE TABLE IF NOT EXISTS Transactions (
        #         transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        #         user_id INTEGER NOT NULL,
        #         amount REAL NOT NULL,
        #         FOREIGN KEY (user_id) REFERENCES User (user_id)
        #     );
        # ''')
        # cursor.execute('''
        #     CREATE TABLE IF NOT EXISTS DepositRequests (
        #         depositRequest INTEGER PRIMARY KEY AUTOINCREMENT,
        #         user_id INTEGER NOT NULL,
        #         reference_id INTEGER NOT NULL,
        #         amount REAL NOT NULL,
        #         data BLOB,
        #         status INTEGER DEFAULT 0
        #         FOREIGN KEY (user_id) REFERENCES Users(user_id)

        #     );
        # ''')
        # cursor.execute('''
        #     ALTER TABLE Orders
        #                     ADD COLUMN  INTEGER DEFAULT 0;
        # ''')
        # cursor.execute('''
        #     DELETE FROM DepositRequests

        # ''')


# create_tables();

# if __name__ == "__main__":

#     import uvicorn

#     uvicorn.run(app, host="localhost", port=5000)
