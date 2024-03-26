import React, { useState } from 'react';
import styled from 'styled-components';

const Withdraw = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleWithdrawal = () => {
    // Handle withdrawal request
    console.log('Withdrawal amount:', withdrawalAmount);
    console.log('Withdrawal method:', withdrawalMethod);
    console.log('Additional info:', additionalInfo);
    // Send withdrawal request to backend API
  };

  const appStyle = {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    maxWidth: '400px',
    alignItems: 'center',
    height: '100vh',
    paddingTop: '20vh'
  };

  return (
    <WithdrawContainer>
      <WithdrawForm>
        <WithdrawHeader>Withdraw Balance</WithdrawHeader>
        <FormGroup>
          <FormLabel>Withdrawal Amount</FormLabel>
          <FormInput
            type="number"
            placeholder="Enter withdrawal amount"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Withdrawal Method</FormLabel>
          <FormSelect
            value={withdrawalMethod}
            onChange={(e) => setWithdrawalMethod(e.target.value)}
          >
            <option value="">Select withdrawal method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
            <option value="Other">Other</option>
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <FormLabel>Additional Information (Optional)</FormLabel>
          <FormTextarea
            rows={3}
            placeholder="Enter any additional information"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </FormGroup>

        <SubmitButton onClick={handleWithdrawal}>Submit Withdrawal Request</SubmitButton>
      </WithdrawForm>
    </WithdrawContainer>
  );
};

export default Withdraw;

const WithdrawContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const WithdrawForm = styled.form`
  width: 400px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const WithdrawHeader = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
