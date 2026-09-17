# EventHub 🎫

A cross-platform event booking application built with **React Native, Expo, TypeScript, Node.js, Express, and SQLite**.

EventHub allows users to discover events, view event details, make and manage bookings, update their profiles, and receive booking-related notifications. Organizers can create, edit, delete, and manage their events and view attendee bookings.

---

## 📌 Project Overview

**EventHub** is designed as a simple event discovery and booking platform for users and event organizers.

The application provides two main user roles:

* **User** – Browse events, make bookings, view bookings, cancel bookings, and manage their profile.
* **Organizer** – Create and manage events and view bookings made for their events.

The project demonstrates a complete cross-platform application with a mobile frontend, REST API backend, authentication, database persistence, and local notifications.

---

## ✨ Features

### 👤 User Features

* Create an account
* User input validation
* Login and logout
* JWT-based authentication
* Persistent login session
* View and update profile
* Browse available events
* Search events
* Filter events by category
* View detailed event information
* Select number of seats
* Validate seat availability
* Book events
* View current and previous bookings
* Cancel confirmed bookings
* Receive booking confirmation notifications
* Receive cancellation notifications
* Schedule event reminder notifications

### 🎤 Organizer Features

* Organizer authentication
* Organizer dashboard
* View own events
* Create new events
* Edit existing events
* Delete events
* View bookings for an event
* View attendee information
* View booking status and seat information

### 🔔 Notification Features

EventHub uses **Expo Notifications** for local notifications.

Current notification flows include:

* **Booking Confirmed**
* **Booking Cancelled**
* **Event Reminder**

> Note: Local notifications are device-based. They do not provide server-side push notifications to other users when an organizer updates an event.

### 🗄️ Database Features

The backend uses SQLite with three main tables:

* `users`
* `events`
* `bookings`

The database also maintains relationships between users, events, organizers, and bookings.

---

## 🛠️ Technology Stack

### Frontend

* React Native
* Expo
* TypeScript
* Expo Router
* AsyncStorage
* Expo Notifications

### Backend

* Node.js
* Express.js
* SQLite
* better-sqlite3
* JWT
* bcryptjs
* CORS
* dotenv

### Development Tools

* Visual Studio Code
* Android Studio
* Android Emulator
* Git
* GitHub

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│        EventHub App          │
│   React Native + Expo        │
│        TypeScript            │
└──────────────┬───────────────┘
               │
               │ REST API
               │ HTTP/JSON
               ▼
┌──────────────────────────────┐
│       Node.js Backend        │
│          Express             │
│                              │
│  Authentication              │
│  Event Management            │
│  Booking Management          │
│  Profile Management          │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          SQLite              │
│                              │
│  Users                       │
│  Events                      │
│  Bookings                    │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```text
EventHub/
│
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── home.tsx
│   │   │   ├── bookings.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── organizer.tsx
│   │   │   ├── create-event.tsx
│   │   │   ├── edit-event/
│   │   │   └── event-bookings/
│   │   │
│   │   ├── booking/
│   │   │   └── [id].tsx
│   │   │
│   │   ├── events/
│   │   │   └── [id].tsx
│   │   │
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authStorage.ts
│   │   └── notificationService.ts
│   │
│   ├── types/
│   │   ├── event.ts
│   │   └── booking.ts
│   │
│   ├── data/
│   │   └── events.ts
│   │
│   └── components/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js
│   │   │   ├── init.js
│   │   │   └── seed.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── events.js
│   │   │   ├── bookings.js
│   │   │   └── profile.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── eventhub.db
│
├── assets/
├── package.json
└── README.md
```

---

## 🔐 Authentication

EventHub uses **JWT-based authentication**.

### Registration

When a user registers:

1. The backend validates the submitted information.
2. The password is hashed using `bcryptjs`.
3. The user is stored in SQLite.
4. A JWT can be generated after successful authentication.

### Login

When a user logs in:

1. The backend verifies the email.
2. The password is compared against the stored bcrypt hash.
3. A JWT is generated.
4. The frontend stores the authentication session using AsyncStorage.

Protected API requests send the token using:

```text
Authorization: Bearer <token>
```

---

## 👥 User Roles

### USER

Regular users can:

* Browse events
* Search and filter events
* View event details
* Make bookings
* View bookings
* Cancel bookings
* Manage their profile

### ORGANIZER

Organizers can:

* Create events
* View their events
* Edit events
* Delete events
* View event bookings
* View attendee information

Organizer-only API operations are protected using JWT authentication and role checking.

---

## 🗃️ Database Schema

### Users

| Field      | Description           |
| ---------- | --------------------- |
| id         | Unique user ID        |
| name       | User's name           |
| email      | Unique email address  |
| password   | Hashed password       |
| role       | USER or ORGANIZER     |
| phone      | Phone number          |
| created_at | Account creation date |

### Events

| Field           | Description           |
| --------------- | --------------------- |
| id              | Unique event ID       |
| organizer_id    | Event organizer       |
| name            | Event name            |
| description     | Event description     |
| image           | Event image URL       |
| date            | Event date            |
| time            | Event time            |
| location        | Event location        |
| category        | Event category        |
| price           | Ticket price          |
| total_seats     | Total available seats |
| available_seats | Remaining seats       |
| created_at      | Event creation date   |

### Bookings

| Field           | Description                        |
| --------------- | ---------------------------------- |
| id              | Unique booking ID                  |
| user_id         | User making the booking            |
| event_id        | Booked event                       |
| booking_date    | Date of booking                    |
| number_of_seats | Number of seats booked             |
| total_price     | Total booking price                |
| status          | CONFIRMED, CANCELLED, or COMPLETED |

---

## 🌐 REST API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Events

```text
GET    /api/events
GET    /api/events/:id
GET    /api/events/mine
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
GET    /api/events/:id/bookings
```

### Bookings

```text
POST /api/bookings
GET  /api/bookings/my
PUT  /api/bookings/:id/cancel
```

### Profile

```text
GET /api/profile
PUT /api/profile
```

---

## 🚀 Getting Started

### Prerequisites

Install the following:

* Node.js
* npm
* Git
* Expo CLI / Expo tooling
* Android Studio if using an Android emulator
* Visual Studio Code

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd EventHub
```

---

## 2. Install Frontend Dependencies

From the main `EventHub` directory:

```bash
npm install
```

---

## 3. Install Backend Dependencies

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 4. Configure Backend Environment

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret
```

For production, use a strong secret value instead of the development example.

---

## 5. Initialize the Database

From the `backend` directory:

```bash
npm run db:init
```

This creates the required SQLite tables.

If seed data is available:

```bash
npm run db:seed
```

---

## 6. Start the Backend

From:

```text
EventHub/backend
```

Run:

```bash
npm run dev
```

The API should start on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 7. Start the Expo Application

Open another terminal in the main project directory:

```bash
cd EventHub
```

Run:

```bash
npx expo start
```

You can then run the application using:

* Android Emulator
* Physical Android device
* Expo development tools
* Web browser

---

## 📱 Android Emulator API Configuration

When running the React Native application on an **Android Emulator**, `localhost` refers to the emulator itself rather than your Windows computer.

Use:

```text
http://10.0.2.2:5000/api
```

For Expo Web, `localhost` can be used:

```text
http://localhost:5000/api
```

If using a physical phone, use your computer's local IPv4 address.

---

## 🧪 Testing

The application should be tested across the major workflows:

### User Testing

* Registration
* Login
* Logout
* Profile update
* Event browsing
* Search
* Category filtering
* Event details
* Booking
* Seat validation
* My Bookings
* Booking cancellation

### Organizer Testing

* Organizer login
* Organizer dashboard
* Create event
* Edit event
* Delete event
* View event bookings

### Notification Testing

* Booking confirmation
* Booking cancellation
* Event reminder

> Expo notification functionality should be tested on a supported native environment such as Android rather than relying on Expo Web.

---

## 🔄 Booking Flow

The main booking process is:

```text
Browse Events
      ↓
Event Details
      ↓
Book Event
      ↓
Enter Number of Seats
      ↓
Validate Availability
      ↓
Create Booking
      ↓
Decrease Available Seats
      ↓
Booking Confirmed
      ↓
Confirmation Notification
      ↓
Event Reminder Scheduled
```

### Cancellation Flow

```text
My Bookings
      ↓
Select Booking
      ↓
Cancel Booking
      ↓
Update Booking Status
      ↓
Restore Available Seats
      ↓
Cancellation Confirmation
      ↓
Cancellation Notification
```

---

## 🔔 Notification Limitations

EventHub currently uses **local device notifications** through Expo Notifications.

This means:

* Booking confirmation notifications are generated locally.
* Cancellation notifications are generated locally.
* Event reminders are scheduled locally.
* Notifications cannot currently be sent remotely from the backend to another user's device.

A production version could introduce a push notification service and device push-token management for real-time notifications across users.

---

## 🛡️ Security

The project includes several basic security measures:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Organizer role authorization
* Event ownership verification
* Booking ownership verification
* Input validation
* SQLite foreign key constraints
* Environment variables for sensitive configuration
* `.env` excluded from Git

---

## ⚠️ Development Notes

The project currently uses SQLite for simplicity and local development.

The frontend contains temporary event data used during development:

```text
src/data/events.ts
```

The REST API is the intended source for event data once the backend is running.

For Android Emulator development, remember to use:

```text
10.0.2.2
```

instead of:

```text
localhost
```

when connecting to the backend running on the development computer.

---

## 🎯 Future Improvements

Possible improvements for a production version include:

* Real-time push notifications
* Event update notifications to booked users
* Advanced event search
* Date-based filtering
* Favorites
* Payment integration
* QR-code tickets
* Digital booking tickets
* Organizer analytics dashboard
* Event reviews and ratings
* Cloud-hosted database
* Image upload instead of image URLs
* Production authentication and security configuration
* Automated testing
* Deployment of the backend API

---

## 📚 Learning Objectives

This project demonstrates practical implementation of:

* Cross-platform mobile development
* React Native
* Expo
* TypeScript
* REST API development
* Node.js and Express
* SQLite database design
* JWT authentication
* Password hashing
* Role-based authorization
* CRUD operations
* API integration
* Local storage
* Notification scheduling
* Form validation
* Navigation
* Error handling
* Git and GitHub

---

## 👨‍💻 Project

**EventHub – Cross-Platform Event Booking Application**

Built as an academic software development project using modern mobile and backend technologies.

---

## 📄 License

This project was created for educational purposes.
