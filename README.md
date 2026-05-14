# Adi Kailash Tour & Travel

A premium, modern full-stack tourism website for spiritual journeys to Adi Kailash and Om Parvat.

## Features
- **Modern UI**: Clean Himalayan spiritual aesthetic with Framer Motion animations.
- **Tour Packages**: Detailed itinerary, pricing, and high-quality visuals.
- **Booking System**: Online enquiry and booking forms integrated with Firebase.
- **Admin Dashboard**: Secure portal for travel agents to manage bookings and enquiries.
- **Real-time**: Live updates using Firebase Firestore.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.
- **WhatsApp Integration**: Floating chat button for instant support.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **Backend**: Node.js, Express (API & Static serving).
- **Database**: Firebase Firestore.
- **Auth**: Firebase Authentication (Google Login).
- **Icons**: Lucide React.
- **Notifications**: React Toastify.

## Setup Instructions

### Pre-requisites
- Node.js installed.
- Firebase project created.

### Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` (use `.env.example` as a template).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Firebase Configuration
1. Obtain your `firebase-applet-config.json` from the Firebase console.
2. Deploy Firestore rules:
   ```bash
   # Use the provided firestore.rules
   ```

### Admin Access
To gain admin access:
1. Sign in via `/admin/login`.
2. Manually set your document's `role` to `'admin'` in the `users` collection in Firestore console.

## Deployment

### Frontend (Netlify/Vercel)
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Render/Cloud Run)
- Port: `3000`
- Start Command: `npm run start`

## Design Palette
- **Saffron**: `#F27D26`
- **Spiritual Blue**: `#1E3A8A`
- **Mountain Dark**: `#0F172A`
- **Mountain Light**: `#F8FAFC`

---
*Created with ❤️ for Himalayan Travelers.*
