# Tutor Booking Platform — Backend 🚀

Professional, scalable, and secure backend API for the Tutor Booking Platform.

## 🔗 Live URLs
- **API Base URL**: [https://tutor-booking-backend.vercel.app](https://tutor-booking-backend.vercel.app )
- **Frontend App**: [https://tutor-booking-frontend.vercel.app](https://tutor-booking-frontend.vercel.app)

## 📝 Project Description
This backend application serves as the core engine for the Tutor Booking Platform. It manages user authentication, role-based access control (RBAC), session scheduling, payments through Stripe, and media storage via Cloudinary. The architecture is modular and follows industry best practices for scalability and maintainability.

## ✨ Features
- **Robust Authentication**: Multi-strategy auth (Email/Password, Google OAuth) powered by Better-Auth.
- **RBAC (Role-Based Access Control)**: Granular permissions for Students, Tutors, and Admins.
- **Session Management**: Native scheduling for tutoring sessions with slot availability.
- **Payment Integration**: Secure transaction processing via Stripe.
- **Media Management**: Efficient image and document storage using Cloudinary.
- **Admin Dashboard**: Comprehensive stats and user management for platform administrators.
- **Automated Seeding**: Auto-creates a Super Admin on first boot.
- **Smart Querying**: Custom `QueryBuilder` for simplified filtering, sorting, and pagination.

## 🛠️ Technologies Used
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Auth**: Better-Auth
- **Payments**: Stripe
- **Storage**: Cloudinary
- **Validation**: Zod
- **Email**: Nodemailer (Gmail SMTP)

## ⚙️ Setup Instructions
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd tutor-booking-backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL="your-postgresql-url"
    BETTER_AUTH_SECRET="your-secret"
    BETTER_AUTH_URL="your-backend-url/api/auth"
    STRIPE_SECRET_KEY="your-stripe-key"
    CLOUDINARY_CLOUD_NAME="your-cloud-name"
    # ... other keys as per .env.example
    ```
4.  **Database Migration**:
    ```bash
    npm run migrate
    ```
5.  **Run in Development**:
    ```bash
    npm run dev
    ```
6.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```
