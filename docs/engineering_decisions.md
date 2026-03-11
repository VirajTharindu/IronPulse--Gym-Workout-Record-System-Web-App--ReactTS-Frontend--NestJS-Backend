# 🧠 Engineering Decisions

This document details the critical technical decisions made during the development of **IronPulse**. These decisions were guided by the goals of performance, scalability, and developer experience.

## 0. System & Folder Architecture
**Overview**: IronPulse uses a modern Modular decoupled architecture to ensure a clean separation between the user interface and the business logic.

### Backend (NestJS Modular Structure)
The backend is organized into domain-specific modules. This ensures that features like `auth`, `workouts`, and `exercises` are self-contained.
- **`src/modules/`**: Contains the core business logic, controllers, and services for each domain.
- **`src/entities/`**: Centralized TypeORM entities for database schema management.
- **`src/common/`**: Shared decorators, filters, and interceptors used across the system.

### Frontend (React Component-Based)
The frontend follows a functional, hook-based architecture designed for reusability and performance.
- **`/src/pages/`**: Route-specific components that compose the main views.
- **`/src/components/`**: Atomic UI elements and specialized business components.
- **`/src/stores/`**: Global state management using Zustand for session and UI states.
- **`/src/hooks/`**: Custom hooks to encapsulate side effects and data fetching logic.

## 1. NestJS Modular Architecture
**Decision**: Adopted a highly modular structure for the backend.
**Reasoning**: NestJS provides a robust framework that encourages separation of concerns. By dividing the application into feature-based modules (Auth, Workouts, Exercises, etc.), we ensure that the codebase remains maintainable and testable as it grows. The dependency injection system simplifies service management and testing.

## 2. TypeORM & SQLite (PostgreSQL & Firebase Ready)
**Decision**: Used TypeORM as the ORM with SQLite for local development, with a roadmap for PostgreSQL and Firebase integration.
**Reasoning**: SQLite offers a zero-configuration database that is portable and perfect for a localized gym tracking system. TypeORM provides an abstraction layer that allows us to switch to a more robust database like PostgreSQL. Furthermore, **Firebase DB** is planned for future integration to provide global scalability and out-of-the-box real-time listeners, complementing the existing Socket.IO infrastructure.

## 3. WebSocket Integration (Socket.IO)
**Decision**: Implementation of real-time communication via Socket.IO.
**Reasoning**: Workout tracking often involves collaborative sessions or live updates. WebSockets allow the system to push updates (like a set being completed) instantly to all connected clients, providing a seamless "live sync" experience that traditional REST polling cannot match.

## 4. React Query for State Synchronization
**Decision**: Utilized `@tanstack/react-query` for all server-state management.
**Reasoning**: Managing asynchronous data in React is complex. React Query handles caching, background re-fetching, and optimistic updates out of the box. This significantly reduces boilerplate code and ensures that the UI always reflects the latest state of the backend with minimal latency.

## 5. Zustand for Global UI State
**Decision**: Chosen Zustand over Redux for client-side state (theme, user session, modals).
**Reasoning**: Zustand provides a minimalist, hook-based API that is much lighter than Redux. It avoids the "boilerplate tax" while providing a clean way to manage global state that doesn't belong in the server cache.

## 6. Security & Performance (Helmet + Throttler)
**Decision**: Integrated `helmet` for HTTP headers and `throttler` for rate limiting.
**Reasoning**: Security is paramount even for portfolio projects. Helmet adds essential security headers, while Throttling prevents brute-force attacks on sensitive endpoints like login and registration.

---

*For more information, contact the author at [virajtharindu1997@gmail.com](mailto:virajtharindu1997@gmail.com).*
