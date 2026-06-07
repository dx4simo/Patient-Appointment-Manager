# Patient Appointment Manager

A web-based admin panel for managing clinic patients and appointments. Built as a portfolio project while applying for an Ausbildung in software development.

---

## About this project

I come from a nursing background and am transitioning into IT. I built this project to demonstrate that I can work with a real tech stack — including authentication, a database, and a multi-page application — not just basic HTML and CSS.

The idea came from something I actually know: patient scheduling is a daily task in any clinic, and the tools used for it are often clunky. This is my own take on what a simple, clean admin interface could look like.

> All patient and appointment data in this project is completely fictional demo data. This is not a real medical system and does not handle real patient information.

---

## Features

- Email and password login with Firebase Authentication
- Protected admin area — login required to access any page
- **Patients** — add, view, edit, and delete patient records
- **Appointments** — create, edit, and delete appointments linked to patients
- **Search and filters** — filter appointments by name, reason, status, and date range
- **Dashboard** — live overview with stat cards, today's appointments, and upcoming appointments
- Persistent login session across page reloads

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, CSS Modules |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Hosting (optional) | Vercel |

No UI libraries, no chart libraries. Everything is built with plain CSS Modules and standard React.

---

## Firebase setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. In **Authentication**, enable the **Email/Password** sign-in method
3. In **Firestore Database**, create a database in production mode
4. Add the following Firestore security rules (in the Rules tab):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Go to **Project settings → Your apps**, register a Web app, and copy the config values into your `.env.local` file (see below)
6. Create a user manually in **Authentication → Users** with the demo credentials or your own

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Firebase project values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

`.env.local` is listed in `.gitignore` and will never be committed.

---

## Demo login

```
Email:    admin@clinicdemo.com
Password: clinic123
```

Create this user in Firebase Authentication → Users before running the app.

---

## Firestore collections

The app uses two top-level collections:

**`patients`**
```
id            (auto-generated)
fullName      string
phone         string
age           number
gender        "male" | "female" | "other"
address       string
createdAt     timestamp
updatedAt     timestamp
```

**`appointments`**
```
id                 (auto-generated)
patientId          string
patientName        string  (stored here to avoid extra lookups)
appointmentDate    string  (YYYY-MM-DD)
appointmentTime    string  (HH:MM)
reason             string
status             "scheduled" | "completed" | "cancelled" | "no-show"
notes              string
createdAt          timestamp
updatedAt          timestamp
```

---

## How to run locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/patient-appointment-manager.git
cd patient-appointment-manager

# 2. Install dependencies
npm install

# 3. Add your Firebase config
cp .env.example .env.local
# then edit .env.local with your values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Notes

- The app is designed as a desktop admin panel. It works on tablets as well, but smaller screens have limited navigation.
- All patient names, phone numbers, and appointment details used during development are completely made up. No real personal or medical data was used at any point.
- This project is for educational and portfolio purposes only.
