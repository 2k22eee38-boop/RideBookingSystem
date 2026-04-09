import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import rideService from '../services/rideService';

function RideBooking() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');

  const bookRide = async () => {
    await rideService.bookRide({ pickup, drop });
  };

  return (
    <div className="glass-card mt-5">
      <h2>Book a Ride</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formPickup">
          <Form.Control 
            type="text"
            placeholder="Pickup Location"
            onChange={(e) => setPickup(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formDropoff">
          <Form.Control 
            type="text"
            placeholder="Drop-off Location"
            onChange={(e) => setDrop(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" onClick={bookRide} className="w-100">
          Find My Ride
        </Button>
      </Form>
    </div>
  );
}

export default RideBooking;