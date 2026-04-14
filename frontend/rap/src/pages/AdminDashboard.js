import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, Tab, Table, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  // Driver creation form states
  const [dName, setDName] = useState('');
  const [dEmail, setDEmail] = useState('');
  const [dPass, setDPass] = useState('');
  const [dConfirmPass, setDConfirmPass] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dResp = await axios.get('http://localhost:8080/admin/drivers');
      setDrivers(dResp.data);
      const rResp = await axios.get('http://localhost:8080/rides');
      setRides(rResp.data);
      const cResp = await axios.get('http://localhost:8080/complaints');
      setComplaints(cResp.data);
      
      const uResp = await axios.get('http://localhost:8080/users');
      const map = {};
      for(let u of uResp.data) {
        map[u.id] = u.name;
      }
      setUsersMap(map);
    } catch(e) {
      console.error(e);
    }
  };

  const deleteDriver = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      await axios.delete(`http://localhost:8080/admin/drivers/${id}`);
      loadData();
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (dPass !== dConfirmPass) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:8080/auth/register', {
        name: dName, email: dEmail, password: dPass, role: 'DRIVER'
      });
      alert('Driver added successfully!');
      setDName(''); setDEmail(''); setDPass(''); setDConfirmPass('');
      loadData();
    } catch (e) {
      alert('Error creating driver.');
    }
  };

  const toggleComplaintStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING';
    await axios.put(`http://localhost:8080/complaints/${id}/status`, { status: newStatus });
    loadData();
  };

  return (
    <div className="glass-card mt-5 mb-5 w-100" style={{maxWidth: '1000px'}}>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Tabs defaultActiveKey="rides" className="mb-3">
        <Tab eventKey="rides" title="Rides & Tracking">
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr><th>ID</th><th>User</th><th>Driver</th><th>Pickup</th><th>Drop</th><th>Status</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {rides.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{usersMap[r.customerId] || r.customerId}</td><td>{usersMap[r.driverId] || r.driverId}</td>
                  <td>{r.pickupLocation}</td><td>{r.dropLocation}</td>
                  <td>{r.status}</td><td>{r.rating || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="drivers" title="Driver Management">
           <Card bg="dark" className="p-3 mb-4 border-info">
             <Card.Title>Register New Driver</Card.Title>
             <Form onSubmit={handleAddDriver}>
               <Row>
                 <Col><Form.Control placeholder="Name" value={dName} onChange={e=>setDName(e.target.value)} required/></Col>
                 <Col><Form.Control type="email" placeholder="Email" value={dEmail} onChange={e=>setDEmail(e.target.value)} required/></Col>
                 <Col><Form.Control type="password" placeholder="Password" value={dPass} onChange={e=>setDPass(e.target.value)} required/></Col>
                 <Col><Form.Control type="password" placeholder="Confirm" value={dConfirmPass} onChange={e=>setDConfirmPass(e.target.value)} required/></Col>
                 <Col xs="auto"><Button type="submit" variant="primary">Add</Button></Col>
               </Row>
             </Form>
           </Card>

           <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Points</th><th>Bonus (₹)</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td><td>{d.name}</td><td>{d.email}</td>
                  <td>{d.points || 0}</td><td>{d.bonus || 0}</td>
                  <td><Button size="sm" variant="danger" onClick={() => deleteDriver(d.id)}>Remove</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="complaints" title="Complaints">
           <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr><th>ID</th><th>Role</th><th>Submitter Name</th><th>Message</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.submitterRole}</td><td>{usersMap[c.submitterId] || c.submitterId}</td>
                  <td>{c.message}</td><td>{c.status}</td>
                  <td>
                    <Button size="sm" variant={c.status === 'PENDING' ? 'success' : 'secondary'} 
                      onClick={() => toggleComplaintStatus(c.id, c.status)}>
                      {c.status === 'PENDING' ? 'Mark Resolved' : 'Mark Pending'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
       </Tabs>
    </div>
  );
}

export default AdminDashboard;