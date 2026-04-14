import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function DriverDashboard() {
  const [usersMap, setUsersMap] = useState({});
  const [usersPhoneMap, setUsersPhoneMap] = useState({});
  const [rides, setRides] = useState([]);
  const [complaintMsg, setComplaintMsg] = useState('');
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [driverStats, setDriverStats] = useState({ points: user.points || 0, bonus: user.bonus || 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const respRides = await axios.get('http://localhost:8080/rides');
        setRides(respRides.data.filter(r => r.driverId === user.id));
        
        const respUsers = await axios.get('http://localhost:8080/users');
        const map = {};
        const phoneMap = {};
        for(let u of respUsers.data) {
          map[u.id] = u.name;
          phoneMap[u.id] = u.phoneNumber || 'N/A';
          if (u.id === user.id) {
            setDriverStats({ points: u.points || 0, bonus: u.bonus || 0 });
          }
        }
        setUsersMap(map);
        setUsersPhoneMap(phoneMap);
      } catch(e) {
        console.error("Error loading driver data", e);
      }
    };
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [user.id]);

  const actionRide = async (id, status) => {
    await axios.put(`http://localhost:8080/rides/${id}`, { status });
    // Reload rides to reflect new status
    try {
      const respRides = await axios.get('http://localhost:8080/rides');
      setRides(respRides.data.filter(r => r.driverId === user.id));
    } catch(e) {}
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
             <Card.Body><Card.Title>Total Points: {driverStats.points}</Card.Title></Card.Body>
          </Card>
        </Col>
        <Col>
          <Card bg="warning" text="dark" className="mb-4 text-center">
             <Card.Body><Card.Title>Earned Bonus: ₹{driverStats.bonus}</Card.Title></Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mt-2">Available / My Rides</h4>
      {rides.map(ride => (
        <Card bg="dark" text="white" className="mb-3 border-secondary" key={ride.id}>
           <Card.Body>
              <Card.Title>Ride #{ride.id} - {ride.status}</Card.Title>
              <Card.Text>
                <strong>Passenger Name:</strong> {usersMap[ride.customerId] || 'Unknown'} 
                <span className="ms-3"><strong>★ Phone:</strong> {usersPhoneMap[ride.customerId] || 'N/A'}</span>
              </Card.Text>
              
              <div className="p-2 mb-3 bg-dark border border-secondary rounded text-white">
                <div><strong>★ Pickup Location:</strong> {ride.pickupLocation || 'Not provided'}</div>
                <div><strong>★ Drop-off Location:</strong> {ride.dropLocation || 'Not provided'}</div>
              </div>
              
              <Card.Text><strong>Fare:</strong> ₹{ride.fare} | <strong>Requested:</strong> {new Date(ride.requestedAt).toLocaleString()}</Card.Text>
              <Button size="sm" variant="success" className="me-2" disabled={ride.status !== 'REQUESTED'} onClick={() => actionRide(ride.id, 'ACCEPTED')}>Accept</Button>
              <Button size="sm" variant="danger" disabled={ride.status !== 'REQUESTED'} onClick={() => actionRide(ride.id, 'CANCELLED')}>Decline</Button>
           </Card.Body>
        </Card>
      ))}

      <Card bg="dark" text="white" className="p-3 mt-4">
        <Card.Title>Driver Support Box</Card.Title>
        <Form.Control as="textarea" value={complaintMsg} onChange={(e) => setComplaintMsg(e.target.value)} placeholder="Report an issue..." />
        <Button onClick={submitComplaint} variant="danger" className="mt-2">Submit Report</Button>
      </Card>
    </div>
  );
}

export default DriverDashboard;
