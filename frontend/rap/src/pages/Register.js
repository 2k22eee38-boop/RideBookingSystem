import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const role = 'USER'; // Hardcoded strictly to USER based on requirements
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await authService.register({ name, email, phoneNumber, password, role });
      window.location.href = '/'; // Trigger full refresh for Auto-login RoleRedirect
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="glass-card mt-5">
      <h2>User Registration</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Control
            type="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPhone">
          <Form.Control
            type="tel"
            placeholder="Phone Number"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Register & Auto-Login
        </Button>
      </Form>
    </div>
  );
}

export default Register;