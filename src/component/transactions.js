import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';


const transactions = [
  { id: 1, type: 'credit', amount: 100, time: '2024-03-20T08:00:00Z' },
  { id: 2, type: 'debit', amount: 50, time: '2024-03-20T08:30:00Z' },
  { id: 3, type: 'credit', amount: 100, time: '2024-03-20T09:00:00Z' },
  { id: 4, type: 'debit', amount: 50, time: '2024-03-20T09:30:00Z' },
  { id: 5, type: 'credit', amount: 100, time: '2024-03-20T10:00:00Z' },
  { id: 6, type: 'credit', amount: 100, time: '2024-03-20T10:30:00Z' },
  { id: 7, type: 'debit', amount: 50, time: '2024-03-20T11:00:00Z' },
  { id: 8, type: 'credit', amount: 100, time: '2024-03-20T11:30:00Z' },
  { id: 9, type: 'debit', amount: 50, time: '2024-03-20T12:00:00Z' },
  // Add more transactions as needed
];


const Transaction = () => {

  // const [transactions, setTransactions] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/transactions/user123'); // Replace 'user123' with the actual user ID
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch transactions');
  //       }
  //       const data = await response.json();
  //       setTransactions(data.transactions);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const appStyle = {

    textAlign: 'center',
    padding: '20px',
    paddingBottom:"80px",
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    maxWidth: '400px',
    height: '100%',
    paddingTop: '60px'
  };



  return (
    <Container style={appStyle}>
      <div className="container">
        {transactions.map(transaction => (
          <Card key={transaction.id} className="mb-3 t-1">
            <Card.Header className="d-flex justify-content-between">
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {new Date(transaction.time).toLocaleDateString()}
              </div>
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {new Date(transaction.time).toLocaleTimeString()}
              </div>
            </Card.Header>
            <Card.Body style={{
              backgroundColor: transaction.type === 'credit' ? '#d4edda' : '#f8d7da',
              border: `1px solid ${transaction.type === 'credit' ? '#c3e6cb' : '#f5c6cb'}`
            }} className="d-flex justify-content-center">
              <div style={{ fontSize: '15px', alignSelf: 'center' }}>
                {transaction.amount}  {transaction.type === 'credit' ? 'Credit' : 'Debit'}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Transaction;
