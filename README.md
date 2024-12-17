# **Project Management System**

## **Table of Contents**
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation and Setup](#installation-and-setup)
5. [Environment Variables](#environment-variables)
6. [Usage](#usage)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
9. [License](#license)

---

## **Introduction**
The **Project Management System** is a web-based application designed to streamline project tracking and task management for candidates. It enables administrators to assign projects, monitor progress, and calculate scores based on completed tasks.

---

## **Features**
- Admin dashboard to manage projects and track progress.
- Candidate dashboard to view assigned projects and update progress.
- Real-time progress tracking for tasks and projects.
- Scoring system based on task completion.
- Role base access for candidates and admins.

---

## **Technology Stack**
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel for (Frontend), Render for (Backend)

---

## **Installation and Setup**
### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/VedNik3/Progress_Report.git
   cd .\Progress_Report\
   ```
 2.Install dependencies for the frontend:
   ```bash
    cd .\frontend\Ionots\
    npm install
   ```
 3. Install dependencies for the backend:
    come back to Progress_Report folder
    ```bash
    cd .\backend\
    npm install

---

## **Environment Variables**
create a .env file in backend folder
```
MONGO_URL = "your mongodb Atlas connection string"
PORT = 5000  
```
If using mongodb compass
```bash
MONGO_URL = "mongodb://127.0.0.1:27017/<any db name>"
```
there are two collections in database:
1.users, 
2.projects

---

## **Important Instruction**
As I have depoly this website , to run it locally, follow the instructions:
in frontend\Ionots folder go to src\utils\constants.js
in this file 
```bash
 export const API_END_POINT_User = "http://localhost:5000/api/user"
 export const API_END_POINT_Project = "http://localhost:5000/api/project"
```
copy paste the above code, instead of present one

---

## **Run**
To run frontend server
```bash
 cd .\frontend\Ionots\
 npm run dev
```
To backend server
```bash
 cd .\backend\
 npm start
```
Now project will run, 

The application opens with the login page. Since there are no users in the database initially, you will need to sign up first.
To create an admin account, you can modify the role of any user from 'candidate' to 'admin' directly in the MongoDB database.

---

## **Access the Deployed Website**
The website is already deployed. You can access it here: [Progress Report Website](https://progress-report-chi.vercel.app/).

## **Credentials for Login**

### **Admin:**
- **ID:** `admin123`

### **Candidates:**
- **ID:** `candidates100`
- **ID:** `candidates101`
- **ID:** `candidates102`








