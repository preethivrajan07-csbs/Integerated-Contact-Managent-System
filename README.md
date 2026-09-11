# 🌍 Integrated Contact Management System (ICMS)

A **Next-Generation Location-Aware Contact Intelligence System** built with **Java Spring Boot** (Backend) and **React TypeScript** (Frontend).

---

## 🚀 Features

- 👤 **User Login & Identity Registration** — Name, Phone, Address with Initial Letter Avatar Badges
- 🗺️ **Interactive World Map** — Plot contacts anywhere on Earth using OpenStreetMap + Leaflet.js
- 📡 **Live GPS Proximity Scan** — Find contacts near you within 5 km to 50 km using HTML5 Geolocation
- 🛡️ **Location Privacy Shield** — Fuzzy Region Centroids protect exact home addresses
- ⚡ **Smart Duplicate Detection** — Auto-detects duplicate phone/email with MERGE / REPLACE / CANCEL options
- 📊 **Relationship Strength Score (0–100)** — Dynamic scoring based on meetings, calls, and interactions
- 🕸️ **Ego-Centric Relationship Graph** — You at centre → Events in middle → People in outer ring
- 📅 **Living Timeline History** — Records every meeting, call, and email interaction
- 🎯 **Smart Context Recommendations** — Suggests relevant contacts for upcoming events
- 🔗 **Event Linking** — Links contacts to specific events (Hackathons, Conferences, Workshops)

---

## 🛠️ Technology Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Leaflet.js |
| **Backend** | Java Spring Boot 3.2, Spring Data JPA, Hibernate ORM |
| **Database** | H2 (In-Memory) / MySQL |
| **API** | RESTful JSON with CORS Security Filter |
| **Maps** | OpenStreetMap + Leaflet.js + Nominatim Geocoding API |

---

## ☕ Java Concepts Used

- **Abstraction** — `Person.java` abstract base class
- **Inheritance** — `Contact extends Person`
- **Encapsulation** — Private fields with getters/setters
- **Exception Handling** — `DuplicateContactException`, `ResourceNotFoundException`, `GlobalExceptionHandler`
- **Multithreading** — `ExecutorService` + `CompletableFuture` in `AnalyticsAsyncService`
- **Collections Framework** — `List`, `ArrayList`, `HashMap`
- **Spring Data JPA** — `@Entity`, `@OneToMany`, `@ManyToMany` ORM mapping

---

## ▶️ How to Run

### 1. Start Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 2. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 3. Open in Browser
Navigate to **`http://localhost:5173`** to use the application.

---

## 📁 Project Structure

```
Integrated contact mangement system 1/
├── backend/                  ← Java Spring Boot Backend
│   ├── src/main/java/com/icms/
│   │   ├── entity/           ← Person, Contact, Event, MeetingLocation...
│   │   ├── service/          ← ContactService, LocationPrivacyService...
│   │   ├── controller/       ← REST API Controllers
│   │   ├── repository/       ← Spring Data JPA Repositories
│   │   └── exception/        ← Custom Exception Handlers
│   └── src/main/resources/
│       └── application.properties
└── frontend/                 ← React TypeScript Frontend
    ├── src/
    │   ├── pages/            ← All Page Components
    │   ├── components/       ← Reusable UI Components
    │   ├── services/         ← API Service Functions
    │   └── types/            ← TypeScript Type Definitions
    └── package.json
```

---

## 👨‍💻 Author

Developed as part of Computer Science & Engineering Project
