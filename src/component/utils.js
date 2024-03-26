import { reauthenticateWithCredential } from "@firebase/auth";
import { api_url } from "../config";
// api.js

const url = api_url


export const fetchUserBalance = async (uid) => {
    console.log(uid)
    const login_details = {
        "user_id": uid
    }
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_details) 
        });

        if (!response.ok) {
            // Handle the error, e.g., show an error message
            console.error('Error fetching balance:', response.statusText);
            return null;
        }
        // console.log(response)
        const data = await response.json();
        // console.log(data.data[4])
        return data.data[4];
    } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
    }
};

export const deposit_money = async (uid,amount) => {

    const deposit_details = {
        "amount": amount
    }
    try {
        const response = await fetch(`${url}/deposit/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deposit_details) 
        });

        if (!response.ok) {
            // Handle the error, e.g., show an error message
            console.error('Error deposit money:', response.statusText);
            return null;
        }
   
        const data = await response.json();
        return data
        
    } catch (error) {
        console.error('Error deposit money:', error);
        return null;
    }
};


export const place_order = async (order) => {
    const uid = order.user_id
    try {
        const response = await fetch(`${url}/order/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        const data = await response.json();
        console.log('this is here so what can id do')
        console.log(data); // Output the response from the server
        return data
        console.log('this is here so what can id do')
        
    } catch (error) {
        console.error('Error placing order:', error.message);
    }
}


export const fetchGameResultsall= async (skip)=>{

        const response = await fetch(`${url}/game_result?skip=${skip}&limit=10`);
        if (!response.ok) {
          throw new Error(`Failed to fetch game results. Status code: ${response.status}`);
        }

        const data = await response.json();
        return data

}

export const fetchorderdetail= async (user_id)=>{
        const response = await fetch(`${url}/order/${user_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders. Status code: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        return data
}


export const updateorderstatus= async (user_id) => {
        const response = await fetch(`${url}/orderstatus/${user_id}`, {
            method: 'PUT'
          });
        if (!response.ok) {
          throw new Error(`Failed to update status. Status code: ${response.status}`);
        }
        const data = await response.json();
        return data
}


