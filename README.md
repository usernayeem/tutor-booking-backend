# Tutor Booking Platform — Backend 🚀

This is the backend application for the Tutor Booking Platform, built following strict, scalable, modular industry architecture guidelines.

## Tech Stack

- **Node.js + Express** (Core Server Framework)
- **TypeScript** (Robust Static Typing)
- **Prisma ORM + PostgreSQL** (High performance DB interaction)
- **Better-Auth** (State-of-the-art authentication package)
- **Stripe** (Secure Payment Gateway)
- **Cloudinary / Multer** (Efficient Media/Image Management)
- **Zod** (Declarative validation)

## Setup & Running Locally

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Duplicate `.env.example`, rename it to `.env`, and populate it with your active secrets (Database string, Stripe keys, SMTP details, etc.).

3. **Apply Database Schema**

   ```bash
   npm run migrate
   ```

4. **Boot Development Server**
   ```bash
   npm run dev
   ```
   _Note: Upon startup, the backend invokes `src/server.ts` which automatically seeds a completely verified `SUPER_ADMIN` user directly into your database if one is not detected!_

## Implemented Modules

| Module Name          | Responsibility                                         | Status                   |
| -------------------- | ------------------------------------------------------ | ------------------------ |
| **Auth**             | Registration, Login, OAuth, OTP emails, Password reset | ✅ Completely configured |
| **Admin**            | Dashboard aggregation stats, RBAC user blocking        | ✅ Completely configured |
| **User & Roles**     | Dynamic mapping for Student, Tutor, and Admins         | ✅ Completely configured |
| **Session Booking**  | Requesting schedule slots natively                     | ✅ Completely configured |
| **Payment (Stripe)** | Processing payments before session finalizing          | ✅ Completely configured |
| **Review**           | Post-session tutor review system                       | ✅ Completely configured |

## Important Development Details

This application implements a custom **`QueryBuilder`** utility class that natively chains search queries, strict filtering fields, nested inclusions, and pagination directly over the active Prisma instance reducing boilerplate down to just two lines of code internally!
