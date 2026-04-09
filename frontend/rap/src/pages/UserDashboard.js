import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function UserDashboard() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [rideStatus, setRideStatus] = useState(null);
  const [complaintMsg, setComplaintMsg] = useState('');
  const [rating, setRating] = useState(5);

  const user = JSON.parse(localStorage.getItem('user'));

  // Very simplified API interaction for booking and tracking
  const bookRide = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post('http://localhost:8080/rides', { pickupLocation: pickup, dropLocation: drop, customerId: user.id });
      setRideStatus(resp.data);
    } catch (err) {
      alert("Error booking ride. Please ensure a 'DRIVER' account is registered in the system!");
    }
  };

  const submitComplaint = async () => {
    await axios.post('http://localhost:8080/complaints', { submitterId: user.id, submitterRole: 'USER', message: complaintMsg });
    setComplaintMsg('');
    alert("Complaint Submitted");
  };

  const submitRating = async () => {
    await axios.put(`http://localhost:8080/rides/${rideStatus.id}/rate?rating=${rating}`);
    alert("Rating applied!");
    setRideStatus(null); // Reset after rating
  };

  return (
    <div className="glass-card mt-5 mb-5 w-100" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Hello, {user.name}</h2>

      {!rideStatus ? (
        <Card bg="dark" className="p-3 mb-4">
          <Card.Title>Book a new Ride</Card.Title>
          <Form onSubmit={bookRide}>
            <Form.Control className="mb-2" placeholder="Pickup Location" onChange={(e) => setPickup(e.target.value)} required />
            <Form.Control className="mb-2" placeholder="Drop Location" onChange={(e) => setDrop(e.target.value)} required />
            <Button type="submit" variant="primary">Search Driver</Button>
          </Form>
        </Card>
      ) : (
        <Card bg="dark" className="p-3 mb-4 border-info">
          <Card.Title>Ride Status: {rideStatus.status}</Card.Title>
          <Card.Text>Driver ID: {rideStatus.driverId || 'Finding...'}</Card.Text>
          <Card.Text>Fare estimated: ₹{rideStatus.fare}</Card.Text>
          <Alert variant="info">Tracking details: Driver is 2 mins away.</Alert>

          {rideStatus.status === 'COMPLETED' ? (
            <div className="mt-3">
              <Form.Label>Rate Driver (1-5)</Form.Label>
              <Form.Select className="mb-2" value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                <option value={1}>1 - Poor</option>
                <option value={3}>3 - Good (+1 Pt)</option>
                <option value={4}>4 - Very Good (+2 Pt)</option>
                <option value={5}>5 - Excellent (+3 Pt)</option>
              </Form.Select>
              <Button onClick={submitRating} variant="success">Submit Rating</Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setRideStatus({ ...rideStatus, status: 'COMPLETED' })}>Simulate Ride Completion</Button>
          )}
        </Card>
      )}

      <Card bg="dark" className="p-3">
        <Card.Title>Feedback / Complaints</Card.Title>
        <Form.Control as="textarea" value={complaintMsg} onChange={(e) => setComplaintMsg(e.target.value)} placeholder="Describe your issue..." />
        <Button onClick={submitComplaint} variant="danger" className="mt-2">Submit</Button>
      </Card>
    </div>
  );
}

export default UserDashboard;
