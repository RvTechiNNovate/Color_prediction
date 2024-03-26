import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Card, Button } from 'react-bootstrap';
import { api_url } from '../config';

const url = api_url;

Modal.setAppElement('#root');
const DepositRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [approvalData, setApprovalData] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/deposit_request/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch deposit requests. Status code: ${response.status}`);
      }

      const result = await response.json();

      setData(result.data);
      
    } catch (error) {
      console.error('Error fetching deposit requests:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

  const openModal = (imageData, request) => {
    console.log(request.data===imageData)
    setSelectedImage(request.data);
    // setSelectedRequest(request);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    // setSelectedRequest(null);
    setModalIsOpen(false);
  };

  const handleApproveConfirmation = (user_id, amount, ref_id) => {
    setApprovalData({ user_id, amount, ref_id });
    setConfirmApprove(true);
  };

  const handleApprove = async () => {
    const { user_id, amount, ref_id } = approvalData;
    await updateBalance(user_id, amount);
    await updateStatus(ref_id, 1);
    setConfirmApprove(false);
  };

  const updateBalance = async (user_id, amount) => {
    try {
      const response = await fetch(`${url}/deposit/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to approve deposit. Status code: ${response.status}`);
      }

      console.log('Balance updated successfully');
    } catch (error) {
      console.error('Error updating balance:', error.message);
    }
  };

  const updateStatus = async (ref_id, flag) => {
    try {
      const response = await fetch(`${url}/deposit_request_status_update/${ref_id}/${flag}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to update approval status. Status code: ${response.status}`);
      }

      console.log('Approval status updated successfully');
    } catch (error) {
      console.error('Error updating approval status:', error.message);
    } finally {
      fetchData();
    }
  };

  return (
    <div>
      <h2>Deposit Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="deposit-cards-container">
          {data.map((result_index) => (
            <Card key={result_index.depositRequest} className={`deposit-card ${result_index.status === 1 ? 'approved' : 'pending'}`}>
              <Card.Body>
                <Card.Title>Deposit result_index</Card.Title>
                <Card.Text>
                  <strong>User ID:</strong> {result_index.user_id} <br />
                  <strong>Reference ID:</strong> {result_index.reference_id} <br />
                  <strong>Amount:</strong> {result_index.amount} <br />
                  <strong>Status:</strong> {result_index.status === 1 ? 'Approved' : 'Pending'} <br />
                </Card.Text>
                <Button onClick={() => openModal(result_index.data, result_index)} className="view-image-button">View Image</Button>
                {!result_index.status ? (
                  <Button onClick={() => handleApproveConfirmation(result_index.user_id, result_index.amount, result_index.depositRequest)} className="approve-button">
                    Approve
                  </Button>
                ) : null}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Image Modal">
      
        {selectedImage && <img src={`data:image/png;base64,${selectedImage}`} alt="Deposit Request" />}
        <Button onClick={closeModal}>Close Modal</Button>
      </Modal>

      <Modal isOpen={confirmApprove} onRequestClose={() => setConfirmApprove(false)} contentLabel="Confirmation Modal">
        <p>Are you sure you want to approve this deposit?</p>
        <Button onClick={handleApprove} className="confirm-approve-button">Yes, Approve</Button>
        <Button onClick={() => setConfirmApprove(false)} className="cancel-button">Cancel</Button>
      </Modal>
    </div>
  );
};

export default DepositRequests;
