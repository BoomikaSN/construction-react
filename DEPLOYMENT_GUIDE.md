# Engineers Veedu — Complete Deployment Guide 🚀

This guide provides simple, step-by-step instructions to deploy the entire **Engineers Veedu** platform (Frontend + Java Backend + MySQL Database + AI Chatbot).

---

## 🎯 Architecture Overview For Deployment

| Component | Technology | Recommended Host (Free Tier Available) |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | **Vercel** or **Netlify** |
| **Backend API** | Spring Boot 3 (Java 17) | **Render** or **Railway** |
| **Database** | MySQL 8 | **Aiven** or **Railway MySQL** |
| **AI Chatbot** | Embedded Spring Boot / Flask | Already packaged inside Spring Boot |

---

## Option 1: Quickest Free Cloud Deployment (Zero Infrastructure Management)

### Step 1: Deploy MySQL Database (Free on Railway / Aiven)
1. Go to **[Railway.app](https://railway.app/)** or **[Aiven.io](https://aiven.io/)** and sign up for free.
2. Click **New Project** → Select **Provision MySQL**.
3. Once created, copy the connection details:
   - **Host** (e.g. `viaduct.proxy.rlwy.net`)
   - **Port** (e.g. `3306` or assigned port)
   - **Database Name** (e.g. `railway` or `engineers_veedu`)
   - **Username** (e.g. `root`)
   - **Password** (generated secure password)

---

### Step 2: Deploy Java Spring Boot Backend (Render.com)
1. Go to **[Render.com](https://render.com/)** and log in with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your repository: `BoomikaSN/construction-react`.
4. Configure service settings:
   - **Name**: `engineers-veedu-api`
   - **Root Directory**: `domain_project/java-backend`
   - **Runtime**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5. Under **Environment Variables**, add:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:mysql://<YOUR_DB_HOST>:<PORT>/<DB_NAME>?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME=<YOUR_DB_USER>
   SPRING_DATASOURCE_PASSWORD=<YOUR_DB_PASSWORD>
   GEMINI_API_KEY=AIzaSy... (optional, fallback AI already active)
   ```
6. Click **Create Web Service**. Render will build and deploy your API with a public URL like:
   `https://engineers-veedu-api.onrender.com` (your API is at `/api`).

---

### Step 3: Deploy Frontend (Vercel)
1. Go to **[Vercel.com](https://vercel.com/)** and sign in with GitHub.
2. Click **Add New** → **Project**.
3. Select `construction-react`.
4. In Project Settings:
   - **Root Directory**: Select `domain_project/frontend`
   - **Framework Preset**: `Vite`
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://engineers-veedu-api.onrender.com/api` (URL from Step 2)
6. Click **Deploy**.
   Vercel will build the frontend and provide your live website URL (e.g., `https://engineers-veedu.vercel.app`).

---

## Option 2: Single-Server VPS / Ubuntu / AWS EC2 Deployment

If deploying to a dedicated server (AWS EC2 / DigitalOcean / Hostinger):

### 1. Install Prerequisites
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven mysql-server nginx nodejs npm
```

### 2. Configure MySQL
```sql
CREATE DATABASE engineers_veedu;
CREATE USER 'veedu_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON engineers_veedu.* TO 'veedu_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Build & Run Java Backend as a System Service
```bash
cd domain_project/java-backend
mvn clean package -DskipTests
nohup java -jar target/backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
```

### 4. Build Frontend & Serve with Nginx
```bash
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### 5. Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/default`)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Reload Nginx:
```bash
sudo systemctl restart nginx
```

---

## 🧪 Verification & Health Check Checklist

After deployment, test the following endpoints:
1. `GET /api/health` → Should return `{"status": "healthy"}`
2. `GET /api/contractors` → Should return list of contractors
3. `POST /api/chat` → Should return chatbot answers
4. Frontend Login → Test with:
   - Client: `moni@gmail.com` / `password`
   - Builder: `boomikasn2006@gmail.com` / `password`
