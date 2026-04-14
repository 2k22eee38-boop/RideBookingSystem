import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function UserDashboard() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [rideStatus, setRideStatus] = useState(null);
  const [complaintMsg, setComplaintMsg] = useState('');
  const [rating, setRating] = useState(5);
  
  // New States for Driver Override Feature
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const user = JSON.parse(sessionStorage.getItem('user'));

  // Feature: Pre-load available drivers whenever rideStatus is null (user is allowed to book)
  useEffect(() => {
    if (!rideStatus) {
      const fetchDrivers = async () => {
        try {
          // Fetch users and active rides to determine busy drivers
          const respUsers = await axios.get('http://localhost:8080/users');
          const respRides = await axios.get('http://localhost:8080/rides');
          
          // Identify drivers who are currently in an active ride workflow
          const activeRides = respRides.data.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
          const busyDriverIds = activeRides.map(r => r.driverId);

          // Map and filter exclusively free drivers
          let drivers = respUsers.data.filter(u => u.role === 'DRIVER' && !busyDriverIds.includes(u.id));
          
          // Shuffle randomly and take only up to 3 random free drivers
          drivers = drivers.sort(() => 0.5 - Math.random()).slice(0, 3);
          
          setAvailableDrivers(drivers);
        } catch (e) { console.error('Error fetching available drivers', e); }
      };
      fetchDrivers();
    }
  }, [rideStatus]);

  useEffect(() => {
    let intervalId;
    if (rideStatus && rideStatus.status !== 'COMPLETED' && rideStatus.status !== 'CANCELLED') {
      intervalId = setInterval(async () => {
        try {
          // Poll for ride updates
          const resp = await axios.get('http://localhost:8080/rides');
          const rides = resp.data;
          // Find the active ride for this user
          const currentRide = rides.find(r => r.id === rideStatus.id);
          if (currentRide) {
            setRideStatus(currentRide);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [rideStatus]);

  // Handle Ride Booking
  const bookRide = async (e) => {
    e.preventDefault();
    try {
      const payload = { pickupLocation: pickup, dropLocation: drop, customerId: user.id };
      if (selectedDriverId && selectedDriverId !== "auto") {
        payload.driverId = parseInt(selectedDriverId);
      }
      const resp = await axios.post('http://localhost:8080/rides', payload);
      setRideStatus(resp.data);
    } catch (err) {
      alert("Error booking ride. Please ensure a 'DRIVER' account is registered and actively available.");
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
        availableDrivers.length === 0 ? (
          <Alert variant="warning" className="text-center">
            <strong>No Drivers Available.</strong><br/>
            Please check back later once an Admin registers active drivers.
          </Alert>
        ) : (
          <Card bg="dark" className="p-3 mb-4">
            <Card.Title>Book a new Ride</Card.Title>
            <Form onSubmit={bookRide}>
              <Form.Control className="mb-2" placeholder="Pickup Location" onChange={(e) => setPickup(e.target.value)} required />
              <Form.Control className="mb-2" placeholder="Drop Location" onChange={(e) => setDrop(e.target.value)} required />
              
              <Form.Select className="mb-3" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)} required>
                <option value="">-- Explicitly Select your Driver --</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} (ID: {d.id})</option>
                ))}
              </Form.Select>

              <Button type="submit" variant="primary">Submit Booking</Button>
            </Form>
          </Card>
        )
      ) : (
        <Card bg="dark" className="p-3 mb-4 border-info">
          <Card.Title>Ride Status: {rideStatus.status}</Card.Title>
          <Card.Text>Driver ID: {rideStatus.driverId || 'Tracing...'}</Card.Text>
          <Card.Text>Fare estimated: ₹{rideStatus.fare}</Card.Text>
          
          {rideStatus.status === 'REQUESTED' && <Alert variant="info">Waiting on Driver...</Alert>}
          
          {rideStatus.status === 'ACCEPTED' && (
             <Alert variant="success">The driver accepted your ride! They are on the way.</Alert>
          )}

          {rideStatus.status === 'CANCELLED' && (
             <Alert variant="danger">
               The driver declined the ride. Please try selecting someone else.
               <div className="mt-2 text-end">
                 <Button size="sm" variant="outline-danger" onClick={() => setRideStatus(null)}>Book Another</Button>
               </div>
             </Alert>
          )}

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

