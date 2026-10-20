# PROJECT REPORT: ENGINEERS VEEDU
**A Digitalized Construction Marketplace & Project Tracking Platform**

---

## ABSTRACT

The rapid growth of the construction and real estate sectors has increased the demand for digitized platforms capable of matching clients with verified builders and offering transparent project tracking. Traditional construction matchmaking methods—including physical site visits, generic directories, and offline quotation processes—face significant challenges such as information opacity, slow response times, and a lack of real-time milestone monitoring. 

This project presents the design and development of **Engineers Veedu**, a digitalized construction marketplace and project tracking platform. The system connects property owners (Clients) with construction contractors (Builders) across the Chennai, Coimbatore, and Madurai regions of Tamil Nadu. 

Engineers Veedu features role-based dashboards, a standardized digital quote request system, dynamic project milestone monitoring, a verified review rating loop, a community forum for homebuilders, and an intelligent Customer Service Assistant powered by Retrieval-Augmented Generation (RAG) using the Google Gemini API (`gemini-2.5-flash`). 

The application is built using a modern full-stack architecture comprising a React (Vite) frontend styled with Tailwind CSS, a Java Spring Boot backend, and a local MySQL database accessed via Hibernate / Spring Data JPA. The RAG assistant processes a local knowledge base of construction documents via token-based keyword indexing and prompt injection to generate grounded, context-aware responses, minimizing hallucination. 

The developed system was successfully validated through end-to-end testing, demonstrating robust authentication, automated project generation on quote acceptance, visual progress tracking with 5-second real-time polling, and contextual Q&A workflows, making it a scalable solution for modernizing the construction service lifecycle.

---

## Table of Contents

```
CHAPTER NO.     TITLE                                             PAGE NO.
1.              Introduction                                      5
                1.1 Background                                    5
                1.2 Problem Statement                             5
                1.3 Motivation                                    6
                1.4 Objectives of the Project                     6
                1.5 Scope of the Project                          7
                1.6 Organization of the Report                    7

2.              Existing Method                                   8
                2.1 Overview                                      8
                2.2 Generic Offline Matchmaking                   8
                2.3 Fragmented Estimations and Quotations         8
                2.4 Manual Site Inspection & Communication        9
                2.5 Standard Non-Contextual Q&A Systems          9
                2.6 Summary of Limitations                         9

3.              Proposed Method with Architecture                10
                3.1 Overview of the Proposed Solution            10
                3.2 Why Engineers Veedu over Alternatives         10
                3.3 System Architecture                           11
                3.4 Component Responsibilities                    11
                3.5 Role-Based Access Design                      12
                3.6 Advantages of the Proposed System             12
                3.7 Functional Modules of the System              13

4.              Methodology                                       15
                4.1 Technology Stack                              15
                4.2 Database Entity Schema and ORM Mapping         15
                4.3 Quote to Active Project Automation Flow        17
                4.4 Real-time Visual Timeline & Polling           17
                4.5 AI Chatbot RAG Pipeline & Keyword Search       18
                4.6 Grounding and Hallucination-Prevention        19

5.              Implementation                                    20
                5.1 Backend Project Structure                     20
                5.2 Core API Implementation Listings             21
                5.3 Frontend Route Protection and Guards          24
                5.4 API Endpoint Summary Table                    25
                5.5 Development Challenges Resolved                26
                5.6 Testing and Validation                        27
                5.7 Functional Test Cases                         28

6.              Conclusion                                        29
                6.1 Summary                                       29
                6.2 Key Achievements                              29
                6.3 Results                                       30
                6.4 Limitations                                   30
                6.5 Future Scope                                  30
                6.6 Learning Outcomes                             31
```

---

## List of Figures

```
FIGURE NO.      TITLE                                             PAGE NO.
3.1             Engineers Veedu system architecture                11
3.2             Role-based redirection & routing dashboard flow    12
4.1             Automated Quote Acceptance to Project Generation   17
4.2             5-Second Client Dashboard Real-time Polling Loop   18
4.3             Local Keyword RAG query process with Gemini API    19
5.1             Backend Spring Boot Package Structure              20
```

---

## List of Tables

```
TABLE NO.       TITLE                                             PAGE NO.
4.1             Engineers Veedu Full Technology Stack             15
5.1             Summary of primary Backend REST API Endpoints     25
5.2             Engineers Veedu Functional Test Cases             28
```

---

## CHAPTER 1: Introduction

### 1.1 Background
The construction sector is one of the largest industries in India, yet it remains heavily unorganized at the micro-level. Building a residential home or a commercial project requires finding trusted contractors, sharing site parameters, negotiating estimates, and tracking the daily progress of construction. Historically, individual clients have had to rely on word-of-mouth recommendations to find builders. Similarly, tracking construction progress requires constant calls or physically visiting the construction site, which leads to disputes regarding materials, deadlines, and payments.

With the rise of modern cloud architectures and Artificial Intelligence (AI), there is an opportunity to digitize this sector. **Engineers Veedu** is a localized digital marketplace and tracking platform designed to bridge this communication gap. By bringing clients and contractors onto a single collaborative workspace, it provides transparent quoting, structured portfolio showcases, and a real-time progress-tracking dashboard. Additionally, an integrated Retrieval-Augmented Generation (RAG) assistant handles customer Q&A regarding construction guidelines and company offerings, making customer support automated and reliable.

### 1.2 Problem Statement
The traditional methods of procuring construction services and monitoring structural milestones are hindered by several critical limitations:
1.  **Lack of Contractor Transparency**: Clients have no centralized directory to search for verified, regional builders, view their actual portfolios of completed works, or read authentic customer reviews.
2.  **Fragmented, Non-Standard Quotations**: Quote requests and estimates are shared via offline paper templates or chaotic email/chat threads, making it difficult to systematically audit quote histories or log project estimates.
3.  **No Dynamic Construction Tracking**: Clients have no visibility into active construction milestones (such as foundation work, brick laying, plastering, or painting) without regular physical site visits.
4.  **Inefficient Q&A Channels**: Property owners seeking details on local zoning codes, typical rates, office locations, or builder specializations must wait for manual reception desks during standard operating hours.

### 1.3 Motivation
*   **Enhance Trust**: Provide verified, localized rating averages based on real client reviews.
*   **Improve Remote Monitoring**: Enable builders to adjust progress bars on dashboards, and allow clients to see visual timeline updates immediately, reducing physical overhead.
*   **Streamline Workflows**: Automate project instantiation directly from accepted quotes, establishing a digital contract history.
*   **Enable 24/7 Automated Support**: Guarantee high-fidelity, grounded answers to common inquiries without hallucination risks.

### 1.4 Objectives of the Project
1.  **Role-Based Dashboards**: Build secure portals for Clients and Builders, protecting access through token verification.
2.  **Contractor Search & Directory**: Implement a multi-region directory filtered by city (Chennai, Coimbatore, Madurai) and builder specialization.
3.  **Quote Automation Engine**: Enable clients to submit standard project quote requests, and automate the creation of active project records once the builder accepts a quote.
4.  **Visual Milestone Timelines**: Develop a vertical construction progress timeline displaying five core stages of physical development.
5.  **RAG Customer Service chatbot**: Build a local keyword-search retrieval system mapping matched policy entries to the Gemini API (`gemini-2.5-flash`) context prompt.

### 1.5 Scope of the Project
This project covers the full-stack design and implementation of the Engineers Veedu platform, comprising:
*   A Vite-based React frontend using Tailwind CSS for UI presentation.
*   A Spring Boot REST backend utilizing Hibernate and Spring Data JPA.
*   A local MySQL relational database storing user records, contractor directories, project details, and quotes.
*   An integrated RAG chatbot querying a local `knowledge_base.json` resource in the Java classpath and communicating with the Google Gemini API.

The project is optimized for local developer setup and testing, utilizing seeded databases on startup to facilitate inspection. It does not cover public DNS configuration, HTTPS certificates, or production-grade load balancers.

### 1.6 Organization of the Report
*   **Chapter 2** reviews the drawbacks of existing offline and generic directory methods.
*   **Chapter 3** outlines the proposed solution, system architecture, and functional modules.
*   **Chapter 4** describes the methodology, including database schemas, quote-to-project automation, timeline polling, and RAG prompt formulation.
*   **Chapter 5** presents the project directory layout, code snippets, API summary tables, and testing matrices.
*   **Chapter 6** concludes with achievements, limitations, learning outcomes, and future scope.

---

## CHAPTER 2: Existing Method

### 2.1 Overview
Before establishing the digital architecture of Engineers Veedu, it is critical to evaluate the traditional and automated systems currently utilized by clients in India to find and monitor builders.

### 2.2 Generic Offline Matchmaking
Most property owners search for builders through personal contacts or offline broker networks. This process is restricted to a small circle of options, offers no formal background checking, and lacks any comparative rating statistics.

### 2.3 Fragmented Estimations and Quotations
When requesting a quote, clients have to explain their requirements repeatedly to multiple builders over the phone or in person. Builders reply with unstructured estimates. Comparing different costs for materials, structural labor, and electrical fittings becomes difficult for the client, and records are frequently lost.

### 2.4 Manual Site Inspection & Communication
To track ongoing construction progress, property owners are forced to travel to the site themselves or depend on contractors sending informal pictures on WhatsApp. This leads to information gaps, and clients are often surprised by delayed deadlines or unexpected material costs.

### 2.5 Standard Non-Contextual Q&A Systems
Many construction firms use basic chatbots on their homepages. These bots are either simple rule-based trees that fail on non-standard phrasing, or general LLM widgets that hallucinate estimated costs and policies, creating legal and operational liabilities for the contractor.

### 2.6 Summary of Limitations
*   Traditional methods require high manual effort and physical travel.
*   Quote history and budget estimates are not auditable or stored securely.
*   There is no connection between an approved budget and actual construction updates.
*   Generic AI assistants risk hallucinating false pricing, building timelines, or service zones.

---

## CHAPTER 3: Proposed Method with Architecture

### 3.1 Overview of the Proposed Solution
Engineers Veedu introduces a unified portal built around two main roles: Clients and Builders. The platform structures contractor discovery, standardized quoting, live progress tracking, and automated customer assistance into one secure system.

### 3.2 Why Engineers Veedu over Alternatives
*   **Targeted Matching**: Focuses specifically on southern Indian regions (Chennai, Coimbatore, Madurai).
*   **Quote-Project Automation**: Instantly starts a trackable construction record when a quote is accepted.
*   **Grounded RAG Bot**: Queries local records to ensure Gemini replies with real company information.
*   **5-Second Real-Time Polling**: Updates the client dashboard instantly when the builder changes the progress slider.

### 3.3 System Architecture
The application uses a three-tier architecture, keeping presentation, business logic, and database operations separate.

```
       +---------------------------------------------+
       |             React Frontend UI               |
       |  (Dashboards, Search Directory, RAG Chat)   |
       +--------------------+------------------------+
                            |
                 REST HTTP  |  JWT Bearer
                            v
       +--------------------+------------------------+
       |            Spring Boot Backend              |
       |  (Controllers, JPA Repositories, RAG Engine)|
       +-------+------------+------------+-----------+
               |                         |
     Hibernate | JPA           HTTP JSON | API Key
               v                         v
       +-------+-------+       +---------+-----------+
       | MySQL Server  |       | Google Gemini API   |
       | (Operational) |       | (gemini-2.5-flash)  |
       +---------------+       +---------------------+
```
*Figure 3.1: Engineers Veedu system architecture*

### 3.4 Component Responsibilities
*   **React Frontend (Vite)**: Runs the SPA UI, manages localStorage user state, and displays the visual timelines.
*   **Spring Boot Backend**: Runs the business services, handles database queries, and secures endpoints using token checking.
*   **MySQL Database**: Stores credentials, contractor details, quotes, active projects, reviews, and forum data.
*   **Gemini AI Engine**: Generates natural language responses for the RAG chatbot.

### 3.5 Role-Based Access Design
Users sign in as either a `client` or a `builder`. The backend returns the user's role and their linked `contractorId`. The frontend uses these attributes to direct users to the correct dashboard and guard views from unauthorized roles.

```
                  +---------------+
                  |  Login Page   |
                  +-------+-------+
                          |
             Role check   v   Credentials matching
             +------------+------------+
             |                         |
     (role == 'client')       (role == 'builder')
             |                         |
             v                         v
   +---------+-------+       +---------+-------+
   | ClientDashboard |       | BuilderDashboard|
   +-----------------+       +-----------------+
```
*Figure 3.2: Role-based redirection & routing dashboard flow*

### 3.6 Advantages of the Proposed System
*   **Referential Integrity**: Connects projects and reviews directly to contractor records.
*   **Reduced Hallucinations**: Ensures Gemini answers using only verified company data.
*   **Real-time Visibility**: Allows clients to track five key construction phases (Planning, Foundation, Brickwork, Plastering, Painting) remotely.

### 3.7 Functional Modules of the System

#### 3.7.1 User Authentication and Profile Module
Handles user registration, login password matching, and profile management. When a user logs in, the backend returns details like their `contractorId` (if they are a builder) to verify account ownership.

#### 3.7.2 Discovery & Search Module
Allows clients to search for contractors by city and specialization. It pulls details dynamically from the MySQL database and maps the average ratings left by clients.

#### 3.7.3 Automated Quoting Module
Allows clients to send structured estimates directly to builders. Once a builder updates a quote to **Accepted**, the system automatically creates an active project in the database.

#### 3.7.4 Visual Progress Tracking Module
Calculates project status dynamically from the builder's progress slider (0% to 100%) and updates the client's screen every 5 seconds.

#### 3.7.5 Community Forum Module
Enables clients and builders to post updates, share building tips, and like or comment on posts.

#### 3.7.6 Grounded AI Q&A Module
Matches user messages against `knowledge_base.json` and injects relevant data into the Gemini prompt, keeping answers accurate and on-topic.

---

## CHAPTER 4: Methodology

### 4.1 Technology Stack
Table 4.1 summarizes the technologies used at each layer of the platform.

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 19.0.0 | User interface rendering |
| **Frontend Tooling** | Vite | 6.1.0 | Fast HMR dev server and builds |
| **Styling** | Tailwind CSS | 3.4.17 | Styling utility framework |
| **Routing** | React Router | 7.1.5 | Routing and client guards |
| **Backend** | Spring Boot | 3.2.5 | Core API framework |
| **ORM** | Hibernate / JPA | 3.2.5 | Database mappings and entity mappings |
| **Java SDK** | JDK | 17 | Core programming language |
| **Database** | MySQL | 8.0 | Relational database storage |
| **AI LLM** | Google Gemini API | 2.5-flash | Natural Language processing and RAG chat |
*Table 4.1: Engineers Veedu Full Technology Stack*

### 4.2 Database Entity Schema and ORM Mapping
The platform uses seven database tables. Relations are managed using Hibernate mappings:

1.  **User (`users`)**:
    ```java
    @Entity
    @Table(name = "users")
    public class User {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @Column(unique = true, nullable = false)
        private String email;
        private String password;
        private String role; // "client" or "builder"
        private String name;
        private String phone;
        private String address;
        private String profilePhotoUrl;
        private Long contractorId; // Links builders to contractor profile
    }
    ```
2.  **Contractor (`contractors`)**:
    ```java
    @Entity
    @Table(name = "contractors")
    public class Contractor {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String name;
        private String specialization;
        private double rating;
        private String city;
        private String contactNumber;
        private int yearsExperience;
        private boolean verified;
        @Column(columnDefinition = "TEXT")
        private String bio;
    }
    ```
3.  **Project (`projects`)**:
    ```java
    @Entity
    @Table(name = "projects")
    public class Project {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String name;
        private String location;
        private int progress; // 0-100%
        private String deadline;
        private String category;
        private String status; // "Planning", "Foundation", "Brick Work", "Plastering", "Painting", "Completed"
        private String description;
        private String image;
        private String clientEmail; // Links to client account
        private Long quoteId; // Links to source quote
        @ManyToOne
        @JoinColumn(name = "contractor_id")
        private Contractor contractor;
    }
    ```
4.  **Quote (`quotes`)**:
    ```java
    @Entity
    @Table(name = "quotes")
    public class Quote {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String name;
        private String email;
        private String message;
        private String projectType;
        private String budget;
        private String expectedDate;
        private String status; // "New Inquiry", "Accepted", etc.
        @ManyToOne
        @JoinColumn(name = "contractor_id")
        private Contractor contractor;
    }
    ```
5.  **Review (`reviews`)**:
    ```java
    @Entity
    @Table(name = "reviews")
    public class Review {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String author;
        private int rating;
        private String text;
        private String date;
        @ManyToOne
        @JoinColumn(name = "contractor_id")
        private Contractor contractor;
    }
    ```

### 4.3 Quote to Active Project Automation Flow
To automate project tracking, the backend generates a new project as soon as a builder accepts a quote.

```
   [ Client submits Quote ] 
             |
             v
   [ Quote status -> "New Inquiry" ] 
             |
             v
   [ Builder accepts Quote ] ---> [ Status updates to "Accepted" ]
                                           |
                                           v
                                [ Auto-Generate Project ]
                                (Sets builder ID & client email)
```
*Figure 4.1: Automated Quote Acceptance to Project Generation*

The trigger logic is implemented in `QuoteController.java`:
```java
if ("Accepted".equalsIgnoreCase(statusUpdate.getStatus()) && !projectRepository.existsByQuoteId(id)) {
    Project autoProject = new Project(
        quote.getName() + " Home Construction",
        "TBD - Contact Client",
        10, // Default 10% progress
        quote.getExpectedDate(),
        quote.getContractor(),
        quote.getProjectType(),
        "Planning",
        quote.getMessage(),
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"
    );
    autoProject.setClientEmail(quote.getEmail());
    autoProject.setQuoteId(quote.getId());
    projectRepository.save(autoProject);
}
```

### 4.4 Real-time Visual Timeline & Polling
The client dashboard displays active project phases using a visual stepper. It updates automatically by polling the backend every 5 seconds.

```
+--------------------------------------------------------------+
|                    Client Dashboard UI                       |
|                                                              |
|   Active Milestones:                                         |
|   ( Planning ) == ( Foundation ) == ( Brickwork ) ...        |
|                                                              |
+------------------------------+-------------------------------+
                               ^
                     GET       |   JSON Response
             /projects/client  |   every 5 seconds
                               v
+------------------------------+-------------------------------+
|                      Java Backend API                        |
+--------------------------------------------------------------+
```
*Figure 4.2: 5-Second Client Dashboard Real-time Polling Loop*

On the frontend, the timeline computes the active step dynamically:
```javascript
const steps = [
    { label: 'Planning', min: 10 },
    { label: 'Foundation', min: 30 },
    { label: 'Brickwork', min: 60 },
    { label: 'Plastering', min: 85 },
    { label: 'Painting', min: 100 }
];
```

### 4.5 AI Chatbot RAG Pipeline & Keyword Search
Instead of using complex external database setups, the AI assistant runs locally by query matching against `knowledge_base.json` on the classpath.

```
[ User sends Query ] 
        |
        v
[ Tokenize & Keyword Match ] 
(Filters top-3 snippets from knowledge_base.json)
        |
        v
[ Context prompt assembly ] 
(Combines matched text + system instructions + history)
        |
        v
[ Send to Gemini API ] 
(Calls gemini-2.5-flash model via RestTemplate)
        |
        v
[ Return response to user ]
```
*Figure 4.3: Local Keyword RAG query process with Gemini API*

### 4.6 Grounding and Hallucination-Prevention
The system prompt enforces strict rules to prevent Gemini from generating incorrect information:
*   "Use the provided context to answer questions accurately."
*   "Never make up information about pricing or timelines."
*   "If you don't know something specific, encourage them to contact us."

---

## CHAPTER 5: Implementation

### 5.1 Backend Project Structure
The backend is organized into standard packages, keeping controllers, models, and configurations separate:

```
java-backend/src/main/java/com/engineersveedu/backend/
|-- BackendApplication.java
|-- config/
|   `-- DataSeeder.java            # Purges and seeds target users & projects
|-- controller/
|   |-- AuthController.java        # Registration, login, profile updates
|   |-- ChatbotController.java     # Local keyword filtering & Gemini API RAG
|   |-- ContractorController.java  # Discovery queries & directory filters
|   |-- ProjectController.java     # Project portfolio & client search
|   `-- QuoteController.java       # Standard quotes & project creation triggers
|-- model/
|   |-- User.java
|   |-- Contractor.java
|   |-- Project.java
|   |-- Quote.java
|   `-- Review.java
|-- repository/
|   |-- UserRepository.java
|   |-- ContractorRepository.java
|   |-- ProjectRepository.java
|   |-- QuoteRepository.java
|   `-- ReviewRepository.java
```
*Figure 5.1: Backend Spring Boot Package Structure*

### 5.2 Core API Implementation Listings

#### 1. RAG Query Matching & LLM Call (`ChatbotController.java`)
```java
@PostMapping("/chat")
public ResponseEntity<?> chat(@RequestBody Map<String, String> requestBody) {
    String userMessage = requestBody.getOrDefault("message", "").trim();
    String sessionId = requestBody.getOrDefault("session_id", "default");

    conversationHistories.putIfAbsent(sessionId, new ArrayList<>());
    List<Map<String, String>> history = conversationHistories.get(sessionId);

    // Filter relevant local knowledge entries
    List<Map<String, String>> relevantDocs = keywordSearch(userMessage, 3);
    
    StringBuilder contextBuilder = new StringBuilder();
    List<String> sources = new ArrayList<>();
    for (Map<String, String> doc : relevantDocs) {
        contextBuilder.append("📄 ").append(doc.get("title")).append(":\n").append(doc.get("content")).append("\n\n");
        sources.add(doc.get("source"));
    }

    // Append session context
    String fullPrompt = SYSTEM_PROMPT + "\n\n---\nRelevant Context from Our Website:\n" + 
                        contextBuilder.toString() + "\n---\n\nCustomer Question: " + userMessage;

    String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> requestPayload = new HashMap<>();
    Map<String, Object> part = new HashMap<>();
    part.put("text", fullPrompt);
    Map<String, Object> content = new HashMap<>();
    content.put("parts", Collections.singletonList(part));
    requestPayload.put("contents", Collections.singletonList(content));

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);
    ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
    
    String answer = extractTextFromGeminiResponse(response.getBody());

    Map<String, Object> result = new HashMap<>();
    result.put("response", answer);
    result.put("sources", sources);
    return ResponseEntity.ok(result);
}
```

#### 2. User & Project Database Seeder (`DataSeeder.java`)
On startup, the system resets the database and seeds the target user accounts:
```java
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ProjectRepository projectRepository;

    @Override
    public void run(String... args) throws Exception {
        // Reset and seed target users
        userRepository.deleteAll();
        
        User client = new User("moni@gmail.com", "password", "client");
        client.setName("Moni");
        client.setPhone("+91 9999999999");
        client.setAddress("Chennai, Tamil Nadu");
        userRepository.save(client);

        User builder = new User("boomikasn2006@gmail.com", "password", "builder");
        builder.setName("Rajesh Kumar");
        builder.setContractorId(1L); // Links to Contractor ID 1
        userRepository.save(builder);
        
        System.out.println("Purged user table and seeded target accounts: moni@gmail.com (client) and boomikasn2006@gmail.com (builder)");

        // Reset and seed construction projects
        projectRepository.deleteAll();
        // Adds initial active project for moni@gmail.com at 60% progress
    }
}
```

#### 3. Real-Time Client Search Endpoint (`ProjectController.java`)
```java
@RestController
@RequestMapping("/api")
public class ProjectController {

    @Autowired private ProjectRepository projectRepository;

    @GetMapping("/projects/client")
    public ResponseEntity<List<Project>> getProjectsByClient(@RequestParam String email) {
        return ResponseEntity.ok(projectRepository.findByClientEmail(email));
    }

    @GetMapping("/projects/contractor/{contractorId}")
    public ResponseEntity<List<Project>> getProjectsByContractor(@PathVariable Long contractorId) {
        return ResponseEntity.ok(projectRepository.findByContractorId(contractorId));
    }
}
```

### 5.3 Frontend Route Protection and Guards
The React application protects client and builder routes using a wrapping layout:
```javascript
const ProtectedRoute = ({ children, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};
```

These guards are defined in `App.jsx` to secure the dashboards:
```javascript
<Route path="/client-dashboard" element={
  <ProtectedRoute allowedRole="client">
    <ClientDashboard />
  </ProtectedRoute>
} />
<Route path="/builder-dashboard" element={
  <ProtectedRoute allowedRole="builder">
    <BuilderDashboard />
  </ProtectedRoute>
} />
```

---

### 5.4 API Endpoint Summary Table

| Endpoint | Method | Payload / Params | Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `{email, password, role}` | `{message, user}` | Registers a new client or builder |
| `/api/auth/login` | `POST` | `{email, password}` | `{token, user}` | Authenticates user; returns JWT token |
| `/api/auth/profile` | `GET` | *Header Token* | `{email, role, name, phone, address, profilePhotoUrl}` | Retrieves logged-in profile data |
| `/api/contractors` | `GET` | `?city=...&specialization=...` | `[Contractor]` | Searches and filters contractors |
| `/api/contractors/{id}/reviews`| `POST` | `{author, rating, text, date}` | `{Review}` | Submits a review and updates contractor rating |
| `/api/quotes` | `POST` | `{name, email, message, projectType, budget, expectedDate, contractorId}` | `{Quote}` | Submits a new quote request to a builder |
| `/api/quotes/{id}/status` | `PUT` | `{status}` | `{message, Quote}` | Updates quote status |
| `/api/projects` | `POST` | `{name, location, progress, deadline, category, status, description, image, contractorId}` | `{Project}` | Adds a new project portfolio item |
| `/api/projects/client` | `GET` | `?email=...` | `[Project]` | Retrieves active projects for a client |
| `/api/projects/contractor/{id}`| `GET` | Path variable `id` | `[Project]` | Retrieves active projects for a contractor |
| `/api/chat` | `POST` | `{message, session_id}` | `{response, sources}` | Submits chat to Gemini-powered AI Assistant |
*Table 5.1: Summary of primary Backend REST API Endpoints*

---

### 5.5 Development Challenges Resolved

#### 1. Path Mapping Conflict
During startup, Tomcat crashed with an `Ambiguous handler methods mapped` exception. Both `ProjectController` and `ContractorController` were mapped to `/api/contractors/{id}/projects`. We fixed this by deleting the duplicate endpoint mapping in `ProjectController.java`.

#### 2. Incomplete User Seeding & Credentials
We found that older credentials left in the browser caused database authorization errors when we rebuilt the user tables. We fixed this by adding `userRepository.deleteAll()` in `DataSeeder.java` to clean old entries and seed only the target test accounts.

#### 3. Broken Quote Request Inputs
The quotation form on the builder profile page was failing because it was missing the customer's name and email. We fixed this by binding the logged-in client profile directly to the submission form.

#### 4. Real-time Synchronization Delay
Clients were not seeing progress updates made by builders on their dashboards. We fixed this by implementing a 5-second asynchronous polling loop in `ClientDashboard.jsx`.

---

### 5.6 Testing and Validation
We verified the system using manual end-to-end testing:
*   **Authentication Check**: Tested logging in with the target accounts (`moni@gmail.com` and `boomikasn2006@gmail.com`).
*   **Quote-to-Project Test**: Submitted a quote request from a client, accepted it as a builder, and confirmed the project appeared on the client dashboard.
*   **Timeline Test**: Updated a project's progress as a builder and verified that the client's timeline changed within 5 seconds.
*   **Chatbot Check**: Sent questions about construction services to the AI assistant and verified that it generated accurate, grounded answers.

### 5.7 Functional Test Cases

| Test Case | Input | Expected Output | Result |
| :--- | :--- | :--- | :--- |
| User Login (Client) | `moni@gmail.com` / `password` | Redirects to Client Dashboard | Pass |
| User Login (Builder) | `boomikasn2006@gmail.com` / `password` | Redirects to Builder Dashboard | Pass |
| Submit Quote Request | Residential, Budget: 50L | Quote status created as "New Inquiry" | Pass |
| Accept Quote | Quote ID 1 status -> "Accepted" | Auto-generates Project at 10% progress | Pass |
| Real-time Progress Update | Progress -> 45% (Builder) | Client timeline updates to "Foundation" | Pass |
| Review Submission | Rating: 5, "Great builder!" | Updates Contractor average rating | Pass |
| AI Chat Query | "Where is your office?" | Replies: "Chennai, Coimbatore, Madurai" | Pass |
*Table 5.2: Engineers Veedu Functional Test Cases*

---

## CHAPTER 6: Conclusion

### 6.1 Summary
The **Engineers Veedu** project delivers a working digital marketplace connecting construction clients and builders. By separating dashboards into custom workspaces, it provides transparent quoting, project portfolios, and real-time progress tracking. The Google Gemini-powered chatbot resolves common questions instantly, reducing administrative delays.

### 6.2 Key Achievements
*   **Working End-to-End Workflow**: Integrates directory searches, quotes, and active progress tracking.
*   **Automatic Project Generation**: Creates project tracking entries automatically on quote acceptance.
*   **Grounded AI Assistant**: Queries local FAQ documents to ensure the chatbot answers accurately without hallucinating.
*   **Real-time Stepper**: Implemented a visual 5-stage progress timeline with 5-second polling.

### 6.3 Results
All functional workflows—including logins, quote requests, project generation, timeline updates, forum posts, and AI chat Q&A—were verified working against the live application.

### 6.4 Limitations
*   **Local Session Memory**: Conversation histories are stored in-memory on the backend and reset on server restart.
*   **Full Database Seeding**: The system clears and seeds test users on every startup, which is useful for development but must be disabled for production.

### 6.5 Future Scope
*   **File Uploads**: Allow clients to upload house layouts and PDF blueprints.
*   **Payment Gateway**: Integrate Razorpay or UPI to handle milestone-based payments securely.
*   **Interactive Maps**: Use geo-location to search and display nearby contractors.
*   **Persistent Chat History**: Save conversation logs in the database to keep them available across devices.

### 6.6 Learning Outcomes
This project provided hands-on experience in full-stack web development: mapping JPA database entities, securing role-based routes in React, designing prompt contexts for LLM APIs, and resolving real integration challenges like route mapping conflicts and synchronization latencies.
