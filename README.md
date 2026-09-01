# 🏥 Mediqo — Doctor Appointment & Hospital Management Platform

**Mediqo** is a full-stack healthcare platform that connects patients, doctors, and administrators through a secure and easy-to-use digital system.

Patients can discover doctors, view their profiles, book appointments, make online payments, and manage their appointments. Doctors can manage their schedules and appointments, while administrators can manage doctors, appointments, and the overall hospital system.

---

## ✨ Features

### 👤 Patient Features

* 🔐 Secure JWT-based authentication
* 📝 User registration and login
* 👨‍⚕️ Browse doctors by specialization
* 📋 View detailed doctor profiles
* ⭐ Doctor experience and consultation fee information
* 📅 Online appointment booking
* 🕐 Date and time-slot selection
* ❌ Appointment cancellation
* 📊 Appointment management and tracking
* 💳 Online payments through Razorpay
* 👤 Profile management
* 📱 Fully responsive user interface

---

### 👨‍⚕️ Doctor Features

* 🔐 Secure doctor authentication
* 📊 Dedicated doctor dashboard
* 📅 Appointment overview
* 🔄 Appointment status management
* 👥 Patient management
* 📜 Appointment history
* 💰 Earnings dashboard
* 🟢 Doctor availability management
* 👤 Doctor profile management

---

### 🛠️ Admin Features

* 🔐 Secure admin authentication
* 📊 Admin dashboard with analytics
* 👨‍⚕️ Add new doctors
* ✏️ Edit doctor information
* 🗑️ Manage doctor profiles
* 📋 View all doctors
* 📅 View and monitor appointments
* 🔄 Appointment status monitoring
* 🏥 Complete hospital management
* 👥 Manage healthcare platform data

---

## 💳 Online Payments

Mediqo integrates **Razorpay** for secure online appointment payments.

Supported payment methods include:

* 💳 Credit Cards
* 💳 Debit Cards
* 📱 UPI
* 🏦 Net Banking

All transactions are processed in **Indian Rupees (INR)**.

---

# 🧑‍💻 Tech Stack

## Frontend

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| React.js     | Frontend UI                |
| Vite         | Development and build tool |
| Tailwind CSS | Styling and responsive UI  |
| React Router | Client-side routing        |
| Axios        | API communication          |
| Context API  | Global state management    |

## Backend

| Technology | Purpose              |
| ---------- | -------------------- |
| Node.js    | JavaScript runtime   |
| Express.js | REST API framework   |
| MongoDB    | Database             |
| Mongoose   | MongoDB ODM          |
| JWT        | Authentication       |
| bcrypt     | Password hashing     |
| Cloudinary | Doctor/image storage |
| Razorpay   | Online payments      |

## Deployment

| Service         | Usage               |
| --------------- | ------------------- |
| Vercel          | Frontend            |
| Vercel / Render | Backend API         |
| Vercel          | Admin Panel         |
| MongoDB Atlas   | Cloud database      |
| Cloudinary      | Cloud image storage |
| Razorpay        | Payment gateway     |

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │       Mediqo Users      │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
          ┌─────────▼─────────┐               ┌─────────▼─────────┐
          │  Patient Frontend │               │    Admin Panel     │
          │   React + Vite    │               │    React + Vite    │
          └─────────┬─────────┘               └─────────┬─────────┘
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                                REST API / Axios
                                      │
                         ┌────────────▼────────────┐
                         │    Node.js + Express    │
                         │       Backend API       │
                         └────────────┬────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
        ┌───────▼───────┐    ┌────────▼────────┐   ┌──────▼───────┐
        │ MongoDB Atlas  │    │   Cloudinary     │   │   Razorpay   │
        │    Database    │    │ Image Storage    │   │   Payments   │
        └────────────────┘    └─────────────────┘   └──────────────┘
```

---

# 🔐 Authentication & Authorization

Mediqo uses **JWT-based role authentication** to protect user accounts and application resources.

The platform supports three primary roles:

### Patient

Patients can:

* Register and log in
* Browse doctors
* View doctor details
* Book appointments
* Make payments
* Manage appointments
* Update their profile

### Doctor

Doctors can:

* Log in securely
* Access their dashboard
* View appointments
* Manage appointment status
* View patient information
* Track earnings
* Manage availability

### Admin

Administrators can:

* Log in securely
* Manage doctors
* View appointments
* Monitor platform activity
* Manage hospital-related information
* Access administrative dashboards

---

# 📁 Project Structure

```text
Mediqo/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── App.jsx
│   └── package.json
│
└── README.md
```

---

# 🔄 Application Workflow

```text
Patient
   │
   ▼
Register / Login
   │
   ▼
Browse Doctors
   │
   ▼
Select Doctor
   │
   ▼
Choose Date & Time Slot
   │
   ▼
Book Appointment
   │
   ▼
Razorpay Payment
   │
   ▼
Appointment Confirmed
   │
   ▼
Manage / Cancel Appointment
```

Doctor workflow:

```text
Doctor Login
     │
     ▼
Doctor Dashboard
     │
     ├── View Appointments
     ├── Manage Patients
     ├── Update Appointment Status
     ├── Manage Availability
     └── View Earnings
```

Admin workflow:

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├── Manage Doctors
     ├── View Appointments
     ├── Monitor Platform
     └── Hospital Management
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Mediqo
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 4. Install Admin Dependencies

```bash
cd ../admin
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ Never commit your `.env` file or expose API keys, database credentials, JWT secrets, or payment credentials publicly.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
```

---

# ▶️ Running the Project Locally

Mediqo consists of three applications:

* Patient Frontend
* Backend API
* Admin Panel

Run each application in a separate terminal.

### Start Backend

```bash
cd backend
npm start
```

or, if using a development script:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:4000
```

### Start Patient Frontend

```bash
cd frontend
npm run dev
```

### Start Admin Panel

```bash
cd admin
npm run dev
```

Vite will display the local development URL in the terminal.

---

# 🌐 API Architecture

The backend follows a RESTful API architecture.

```text
Frontend / Admin
       │
       │ HTTP Requests
       ▼
   Express Router
       │
       ▼
  Authentication
   Middleware
       │
       ▼
   Controller
       │
       ▼
    Mongoose
       │
       ▼
   MongoDB Atlas
```

Typical API modules include:

```text
/api/user
/api/doctor
/api/admin
/api/appointment
```

The exact endpoints may vary depending on the implementation.

---

# 🗄️ Database

Mediqo uses **MongoDB Atlas** as its cloud database with **Mongoose** for schema definition and database operations.

Major data entities include:

```text
User
 │
 ├── Authentication details
 ├── Profile information
 └── Appointment information


Doctor
 │
 ├── Personal information
 ├── Specialization
 ├── Experience
 ├── Consultation fee
 ├── Availability
 └── Appointment information


Appointment
 │
 ├── Patient
 ├── Doctor
 ├── Date
 ├── Time slot
 ├── Payment status
 └── Appointment status
```

---

# ☁️ Cloudinary Integration

Doctor profile images and other required media are stored using **Cloudinary**.

The backend handles:

```text
Image Upload
     │
     ▼
Backend API
     │
     ▼
Cloudinary
     │
     ▼
Secure Image URL
     │
     ▼
MongoDB
```

Instead of storing image files directly in MongoDB, Mediqo stores the Cloudinary URL associated with the relevant record.

---

# 💰 Razorpay Payment Flow

The payment process works approximately as follows:

```text
Patient
   │
   ▼
Select Appointment
   │
   ▼
Create Payment Order
   │
   ▼
Razorpay Checkout
   │
   ▼
Payment
   │
   ▼
Payment Verification
   │
   ▼
Appointment Confirmation
```

Payment amounts are handled in **INR**.

For production deployment, Razorpay credentials should be stored securely as environment variables.

---

# 📱 Responsive Design

Mediqo is designed to provide a responsive experience across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The frontend uses **Tailwind CSS** to create responsive layouts and reusable UI components.

---

# 🔒 Security

Mediqo implements several security practices, including:

* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization
* Protected API routes
* Environment variables for secrets
* Secure payment verification
* Cloud-based image storage
* Separation of patient, doctor, and admin permissions

---

# 🚀 Deployment

The project can be deployed using:

```text
Patient Frontend  → Vercel
Admin Panel       → Vercel
Backend API       → Render / Vercel
Database          → MongoDB Atlas
Images            → Cloudinary
Payments          → Razorpay
```

### Production Architecture

```text
                    Internet
                       │
          ┌────────────┴────────────┐
          │                         │
       Vercel                    Vercel
          │                         │
   Patient Frontend             Admin Panel
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                 Backend API
              Node.js + Express
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      MongoDB      Cloudinary    Razorpay
       Atlas
```

---

# 🧪 Development

Before creating a production build, verify:

* Authentication works correctly
* Protected routes are secured
* Doctor availability is working
* Appointment slots cannot be incorrectly duplicated
* Appointment cancellation works
* Payment verification works
* Admin operations are protected
* Environment variables are configured
* CORS is configured correctly
* Production API URLs are configured in the frontend

---

# 🎯 Future Improvements

Possible future enhancements for Mediqo include:

* 💬 Doctor-patient chat
* 📹 Online video consultation
* 🔔 Real-time appointment notifications
* 📧 Email appointment confirmations
* 📱 SMS notifications
* 🧾 Digital prescriptions
* 📄 Medical report uploads
* 🏥 Multiple hospital/clinic support
* ⭐ Doctor reviews and ratings
* 🔎 Advanced doctor search and filtering
* 📊 Advanced analytics for administrators
* 🩺 Patient medical history
* 📅 Advanced doctor scheduling
* 🤖 AI-powered healthcare assistance

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add: your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

# 📄 License

This project is developed for educational and project purposes.

If you plan to use or distribute this project commercially, add an appropriate open-source or proprietary license.

---

# 👨‍💻 Author

**Sandesh**

Computer Science Engineering Student
Full-Stack Developer | Java | MERN | DSA

---

## ⭐ Show Your Support

If you find **Mediqo** useful or interesting, consider giving the repository a ⭐ on GitHub.

---

**Mediqo — Connecting Patients with Better Healthcare. 🏥**
