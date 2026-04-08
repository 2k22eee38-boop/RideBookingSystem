# 🚖 Ride Booking System

## 📌 Overview

This project is a **Ride Booking System** built using **Spring Boot** and a database backend. It allows customers to request rides, drivers to accept rides, and manages the complete ride lifecycle with proper business rules.

---

## 🎯 Problem Statement

Develop a system where:

* Customers can request rides
* Drivers can accept rides
* System assigns nearest available driver
* Ride lifecycle is tracked from request to completion

---

## 🧱 Tech Stack

* Backend: Spring Boot (Java)
* Database: PostgreSQL / Supabase (or MongoDB based on design)
* API Testing: Thunder Client / Postman
* Version Control: GitHub

---

## 📂 Data Models

### 👤 User

```
{
  _id,
  name,
  role (CUSTOMER / DRIVER / ADMIN),
  location: { lat, lng },
  availabilityStatus
}
```

### 🚗 Ride

```
{
  _id,
  customerId,
  driverId,
  pickupLocation,
  dropLocation,
  fare,
  status,
  requestedAt
}
```

---

## 🔄 Ride Lifecycle

```
REQUESTED → ACCEPTED → STARTED → COMPLETED → CANCELLED
```

---

## ⚙️ Business Rules

* Only **AVAILABLE drivers** can accept rides
* A driver can handle **only one ride at a time**
* Fare is **auto-calculated based on distance**
* Ride **cannot be cancelled after STARTED**
* Driver becomes **UNAVAILABLE once ride is accepted**

---

## 🚀 Features

### 👤 Customer

* Request a ride
* Track ride status

### 🚗 Driver

* View available rides
* Accept ride
* Update ride status

### 🛠️ Admin

* View ride analytics
* Monitor system activity

---

## 🔥 Backend Challenges Solved

* Location-based driver assignment
* Preventing double assignment of drivers
* Ride lifecycle management
* Aggregation queries:

  * Total rides per driver
  * Total earnings per driver

---

## 📡 API Endpoints

### 🔹 Auth APIs

```
POST /auth/register
POST /auth/login
```

### 🔹 Ride APIs

```
POST /rides           → Request ride
PUT /rides/{id}      → Update ride status
GET /rides           → Get all rides (optional)
```

---

## 🧪 Sample Request

### Create Ride

```
POST /rides
```

```json
{
  "pickupLocation": "Chennai",
  "dropLocation": "Coimbatore",
  "userId": 1
}
```

---

## 🔐 Environment Variables

Sensitive data is stored using environment variables:

```
DB_URL=your_database_url
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

## ▶️ Run the Project

```
mvn clean install
mvn spring-boot:run
```

---

## 📊 Future Enhancements

* JWT Authentication
* Real-time ride tracking
* Payment integration
* Microservices architecture
* Deployment (AWS / Docker)

---

## 🧠 Learning Outcomes

* Spring Boot backend development
* REST API design
* Database modeling
* Real-world problem solving
* Team collaboration

---

## 📌 Conclusion

This project demonstrates a scalable and structured approach to building a **real-world ride booking system**, covering core backend concepts and business logic.


