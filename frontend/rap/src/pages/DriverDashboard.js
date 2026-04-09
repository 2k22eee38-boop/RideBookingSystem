import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [complaintMsg, setComplaintMsg] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // In actual app, fetch all rides filtered for this driver.
    const loadRides = async () => {
      try {
        const resp = await axios.get('http://localhost:8080/rides');
        setRides(resp.data);
      } catch(e) {}
    };
    loadRides();
  }, []);

  const actionRide = async (id, status) => {
    await axios.put(`http://localhost:8080/rides/${id}`, { status });
    alert("Ride status updated");
  };

  const submitComplaint = async () => {
    await axios.post('http://localhost:8080/complaints', { submitterId: user.id, submitterRole: 'DRIVER', message: complaintMsg });
    setComplaintMsg('');
    alert("Complaint Submitted");
  };

  return (
    <div className="glass-card mt-5 mb-5 w-100" style={{maxWidth: '800px'}}>
      <h2 className="mb-4">Driver Portal: {user.name}</h2>
      
      <Row>
        <Col>
          <Card bg="success" text="white" className="mb-4 text-center">
             <Card.Body><Card.Title>Total Points: {user.points || 0}</Card.Title></Card.Body>
          </Card>
        </Col>
        <Col>
          <Card bg="warning" text="dark" className="mb-4 text-center">
             <Card.Body><Card.Title>Earned Bonus: ₹{user.bonus || 0}</Card.Title></Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mt-2">Available / My Rides</h4>
      {rides.map(ride => (
        <Card bg="dark" className="mb-3 border-secondary" key={ride.id}>
           <Card.Body>
              <Card.Title>Ride #{ride.id} - {ride.status}</Card.Title>
              <Card.Text>From: {ride.pickupLocation} To: {ride.dropLocation}</Card.Text>
              <Card.Text>Fare: ₹{ride.fare}</Card.Text>
              <Button size="sm" variant="success" className="me-2" onClick={() => actionRide(ride.id, 'ACCEPTED')}>Accept</Button>
              <Button size="sm" variant="danger" onClick={() => actionRide(ride.id, 'CANCELLED')}>Cancel</Button>
           </Card.Body>
        </Card>
      ))}

      <Card bg="dark" className="p-3 mt-4">
        <Card.Title>Driver Support Box</Card.Title>
        <Form.Control as="textarea" value={complaintMsg} onChange={(e) => setComplaintMsg(e.target.value)} placeholder="Report an issue..." />
        <Button onClick={submitComplaint} variant="danger" className="mt-2">Submit Report</Button>
      </Card>
    </div>
  );
}

export default DriverDashboard;
