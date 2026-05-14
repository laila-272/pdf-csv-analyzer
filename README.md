# DeepGuard X

DeepGuard X is an intelligent document analysis platform powered by Large Language Models (LLMs) using a Retrieval-Augmented Generation (RAG) pipeline.

The system supports:
- PDF summarization
- Context-aware question answering
- Distributed PDF indexing
- Security scanning before processing

---

# Features

- Upload and analyze PDF documents
- AI-powered document summarization
- Context-aware Q&A over uploaded files
- Distributed PDF processing across multiple machines
- Secure file scanning before processing
- Fast vector search using FAISS
- Responsive and modern user interface
- Authentication and protected routes
- Admin dashboard and management features

---

# System Architecture

```text
User (Browser / Mobile)
              ↓
         Nginx :80
    (Single entry point)
         ↓          ↓
    Frontend      Backend
    React/Vite    Node.js
    :5173         :3000
                    ↓
              Cyber Service
              Python/FastAPI
              (Security Scan)
                    ↓
              AI Engine
              Python/FastAPI
              :8000
                    ↓
         Distributed PDF Processing
         ↙                    ↘
   Manager Machine       Worker Machines
         ↘                    ↙
      Merge Vectors → Build FAISS Index
```

---

# My Role

I was responsible for developing the complete frontend side of the application using React and Vite.

My responsibilities included:

- Building responsive and modern user interfaces
- Developing the complete application layout and frontend architecture
- Integrating frontend pages with backend APIs
- Implementing authentication and protected routes
- Creating the PDF upload workflow and document management UI
- Developing the document summarization and context-aware Q&A interfaces
- Building admin dashboard pages and management features
- Managing application state and API requests using modern React practices
- Implementing routing and dynamic page navigation
- Improving user experience, responsiveness, and frontend performance
- Connecting the frontend with AI-powered backend services
- Handling loading states, error handling, and user feedback interactions
- Creating reusable and scalable React components

---

# Frontend Technologies

- React
- Vite
- React Router
- React Query
- Axios
- CSS / Tailwind CSS
- Context API

---

# Backend & AI Technologies

- Node.js
- FastAPI
- MongoDB
- Docker
- Nginx
- FAISS
- Ollama
- Python
- RAG Pipeline

---

# Docker Infrastructure

The system uses a shared Docker network (`deepguard-network`) with all services isolated internally.

| Service | Technology | Port | External Access |
|---|---|---|---|
| MongoDB | mongo:latest | 27017 | ❌ |
| Cyber Service | Python / FastAPI | 5000 | ❌ |
| Backend | Node.js | 3000 | ❌ |
| Frontend | React/Vite | 5173 | ❌ |
| Nginx Gateway | nginx:alpine | 80 | ✅ |

---

# Distributed Processing System

## Problem

Generating embeddings and building a FAISS index for large PDFs on a single machine is slow.

## Solution

The PDF is split across multiple machines that process pages simultaneously.

## Workflow

1. User uploads a PDF
2. Manager machine counts total pages
3. Pages are distributed across available machines
4. Each machine:
   - Extracts text
   - Splits text into chunks
   - Generates embeddings using Ollama
   - Normalizes vectors
5. Manager collects all vectors
6. Builds a unified FAISS index
7. Saves the index to `vs_cache`

---

# Performance Results

| Mode | Processing Time (57 pages) |
|---|---|
| Single Machine | ~5 minutes |
| 2 Machines | ~2.7 minutes |
| 3 Machines | ~1.9 minutes |

---

# Running The System

## Clone The Repository

```bash
git clone https://github.com/your-username/deepguard-x.git
```

## Install Frontend Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

## Run Core Services

```bash
docker-compose up -d --build
```

## Run AI Engine

```bash
cd ai_service
python api_server.py
```

## Run Worker Node

```bash
python worker_server.py
```

---

# Folder Structure

```bash
src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── routes/
 ├── services/
 ├── hooks/
 ├── context/
 ├── styles/
 └── utils/
```

---

# Future Improvements

- Real-time collaborative document analysis
- Cloud deployment support
- Advanced AI summarization models
- User activity analytics
- Multi-language support

---

# Author

Laila Mostafa  
Frontend Developer — Tanta University
