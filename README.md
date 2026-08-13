# 🏕️ RentRover - Sports & Outdoor Gear Rental

**RentRover** is a full-stack gear rental application that connects outdoor enthusiasts with equipment providers. It covers the complete rental workflow, from browsing and booking gear to payment processing, inventory management, and rental tracking.

This repository contains the frontend application, built with Next.js App Router and React Query, focusing on a responsive, role-based user interface.

🔗 **Live Demo:** [https://rentrover-web.vercel.app/](https://rentrover-web.vercel.app/)

---


## 📑 Table of Contents

- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Frontend Routes & API Integration](#-frontend-routes--api-integration)
- [Security & Architecture Notes](#-security--architecture-notes)
- [Application Previews](#-application-previews)

---

## ✨ Key Features

- **Role-Based Dashboards:** Dedicated, secure interfaces for **Customers** (to track rentals & payments), **Providers** (to manage gear inventory & incoming orders), and **Admins** (to moderate users, gear, and categories).
- **Dynamic Gear Marketplace:** Real-time search, category filtering, and sorting (by price, condition, popularity) to help users find exactly what they need.
- **Seamless Booking & Payments:** Integrated with **Stripe** for secure, automated payments. The platform processes transactions natively in **BDT (৳)**.
- **Automated Stock Management:** Real-time stock deduction upon successful payment and automatic restoration when gear is returned.
- **Review & Rating System:** Only customers with completed rentals can submit ratings and reviews.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Library:** [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) components
- **State Management & Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest) & Next.js Server Actions
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons & Notifications:** [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.ski/)
- **Authentication:** JSON Web Tokens (JWT) & `httpOnly` Cookies

---

## 📂 Project Structure

```text
rentrover-frontend/
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── (admin)/         # Admin dashboard routes & actions
│   │   ├── (auth)/          # Authentication routes (login, register)
│   │   ├── (customer)/      # Customer dashboard & rental logic
│   │   ├── (payment)/       # Payment success/cancel pages
│   │   ├── (provider)/      # Provider dashboard & inventory management
│   │   ├── (public)/        # Public-facing pages (home, gear browse)
│   │   ├── api/             # Next.js API Routes (Proxy)
│   │   └── services/        # Centralized API service functions
│   ├── components/          # Reusable React components (UI, shared)
│   ├── lib/                 # Utility libraries (QueryClient, API configs)
│   └── utils/               # Helper functions
├── public/                  # Static assets
└── tailwind.config.ts       # Tailwind CSS configuration
```

---

## 🚀 Getting Started (Local Development)

Follow these steps to run the frontend application locally on your machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A running instance of the RentRover Backend server.

### 1. Clone the repository

```bash
git clone https://github.com/webpromahdi/rentrover-frontend.git
cd rentrover-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure the required variables. Use the `.env.example` file as a reference.

```env
# The URL of your running RentRover backend API
BACKEND_API_URL=http://localhost:5000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🌐 Frontend Routes & API Integration

The frontend consumes the RentRover Backend REST API and provides a structured routing system. Authentication is handled securely via `httpOnly` cookies (`accessToken`).

For a complete and detailed list of all frontend routes, backend endpoints, and their respective integrations, please refer to the [API Integration Documentation](API_INTEGRATION.md).

---

## 🔒 Security & Architecture Notes

- **Server Actions:** Sensitive data fetching and mutations are securely handled server-side using Next.js Server Actions.
- **Idempotency:** Payment endpoints check transaction statuses before deducting stock to prevent double-charging or inaccurate inventory.
- **Caching Strategy:** `TanStack Query` is heavily utilized on the client-side for immediate UI updates, cache invalidation, and seamless dashboard interactions.
- **Protected Routes:** Next.js middleware is used to verify authentication cookies and authorize route access before rendering pages, preventing unauthorized access to dashboards.

---

## 📸 Application Previews

### Home Page
![Home Page](./public/screenshots/Home%20Page.png)

### Gear Marketplace
![Gears Page](./public/screenshots/Gears%20Page.png)

### Booking Page
![Booking Page](./public/screenshots/Booking%20Page.png)

### Customer Dashboard
![Customer Dashboard](./public/screenshots/Customer%20Dashboard.png)

### Provider Dashboard
![Provider Dashboard](./public/screenshots/Provider%20Dashboard.png)

### Admin Dashboard
![Admin Dashboard](./public/screenshots/Admin%20Dashboard.png)

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
