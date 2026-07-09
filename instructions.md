# Construction React - Project Instructions & Blueprint

## 1. What We Have Done So Far
In our recent sessions, we have focused on making the core functionalities of the application fully workable for local usage, avoiding unnecessary complexities like advanced security configurations. Here's what has been accomplished:

* **Repository Setup**: Migrated the repository to the correct fork (`Sudarshan-prog`) and fixed the `.gitignore` to prevent committing unnecessary files (like `node_modules/` and `target/`).
* **Profile Management (Backend & Frontend)**:
  * Implemented a `getProfile()` and `updateProfile()` endpoint on the Java Backend.
  * Integrated a functional "Edit Profile" modal in both the `ClientDashboard` and `BuilderDashboard`.
  * Pre-filled the profile forms with existing user data (Name, Phone, Address, Profile Photo URL).
* **Quote Submission Fix**:
  * Found and fixed a critical bug where the Quote Request form in the `ContractorDetail` page was failing silently because it missed the "Name" and "Email" fields.
  * Pre-filled the Quote Request email based on the logged-in user.
* **Dashboard Integration**:
  * Connected the `ClientDashboard` "Request New Quote" button to navigate properly to the Contractors Directory.
  * Verified that submitted quotes now successfully appear in the `BuilderDashboard` under "New Quote Requests".

---

## 2. How to Run the Project Locally

### Prerequisites
* **Java 17+** (For the Spring Boot backend)
* **Node.js** (For the React/Vite frontend)
* **MySQL** (Running locally on default port 3306)

### Database Setup
1. Open MySQL and create the database if it doesn't exist:
   `CREATE DATABASE IF NOT EXISTS engineers_veedu;`
2. Ensure your `application.properties` (in `java-backend/src/main/resources`) has the correct MySQL username and password (currently set to `root` / `Mysqlpog@123`).

### Starting the Backend
1. Open a terminal.
2. Navigate to the backend folder: `cd java-backend`
3. Run the Spring Boot application:
   * Windows: `.\mvnw spring-boot:run`
   * Mac/Linux: `./mvnw spring-boot:run`
4. The backend will run on `http://localhost:8081`.

### Starting the Frontend
1. Open a new, separate terminal.
2. Navigate to the frontend folder: `cd frontend`
3. Install dependencies (if you haven't already): `npm install`
4. Start the development server: `npm run dev`
5. The frontend will be accessible at `http://localhost:5173`.

---

## 3. Blueprint to Complete the Project (Functionality Focus)
Since the focus is on a fully functional local build rather than production deployment, here are the remaining core features to implement step-by-step:

### Phase 1: Quote Workflow & Status Updates
* **Actionable Builder Dashboard**: The Builder Dashboard currently shows quote requests but needs an "Update Project Status" feature.
  * **Goal**: Allow builders to accept/reject quotes and update status (e.g., "In Progress", "Completed").
  * **Implementation**: Wire up the "Update Project Status" button to open a modal that hits a `PUT /api/quotes/{id}/status` endpoint.
* **Client Visibility**: Ensure the Client Dashboard accurately reflects the updated status of their quotes.

### Phase 2: Project Gallery & Portfolio Management
* **Contractor Portfolios**: Builders should be able to upload or add new projects to their portfolio.
  * **Goal**: Build a "My Portfolio" section in the Builder Dashboard.
  * **Implementation**: Create a POST `/api/projects` endpoint and a corresponding frontend form for builders to add image URLs, titles, and descriptions.

### Phase 3: Reviews & Ratings System
* **Review Submission**: Currently, the Review form in `ContractorDetail.jsx` uses mock data.
  * **Goal**: Save client reviews to the database.
  * **Implementation**: Create a POST `/api/reviews` endpoint. Link it to a `Review` entity mapped to `Contractor` and `Client`.
* **Dynamic Ratings**: Calculate the contractor's overall rating dynamically based on the submitted reviews.

### Phase 4: Community / Forum (Optional but Recommended)
* **Community Posts**: Allow users to share posts in the Community page.
  * **Goal**: Replace the mock `communityPosts` data with real database calls.
  * **Implementation**: Connect `Community.jsx` to `CommunityController` endpoints (`GET` and `POST` for posts and likes).

### Phase 5: Final Polish
* **Remove Fallback Data**: Remove `FALLBACK_CONTRACTOR`, `FALLBACK_PROJECTS`, etc., from all components to strictly rely on the database.
* **Consistent Navigation**: Ensure all internal links, back buttons, and redirects behave logically for both Client and Builder roles.
