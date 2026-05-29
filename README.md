# ✦ TaskFlow — Full-Stack Task Management App

> A clean, fast, and intuitive task manager built with React + FastAPI.

![TaskFlow](https://img.shields.io/badge/Built%20with-React%20%2B%20FastAPI-E8500A?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

-----

## 🚀 What It Does

TaskFlow is a full-stack productivity application for managing tasks across projects and categories. It features a clean, minimal UI with real-time updates, priority management, filtering, and progress tracking.

**Features:**

- Create, edit, delete, and complete tasks
- Priority levels (High / Medium / Low) with visual indicators
- Category filtering (Work, Personal, Design, Development)
- Due date tracking with overdue alerts
- Progress bar showing overall completion
- Search across all tasks
- Sort by newest, priority, or due date
- REST API backend with full CRUD endpoints

-----

## 🛠 Tech Stack

|Layer     |Technology                               |
|----------|-----------------------------------------|
|Frontend  |React, CSS-in-JS                         |
|Backend   |Python, FastAPI                          |
|Database  |PostgreSQL (production) / In-memory (dev)|
|Deployment|AWS EC2 / Docker                         |

-----

## 📁 Project Structure

```
taskflow/
├── frontend/
│   └── src/
│       └── App.jsx
├── backend/
│   ├── main.py
│   └── requirements.txt
└── README.md
```

-----

## ⚙️ Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

-----

## 🔌 API Endpoints

|Method  |Endpoint     |Description                     |
|--------|-------------|--------------------------------|
|`GET`   |`/tasks`     |Get all tasks (supports filters)|
|`POST`  |`/tasks`     |Create a new task               |
|`GET`   |`/tasks/{id}`|Get a single task               |
|`PATCH` |`/tasks/{id}`|Update a task                   |
|`DELETE`|`/tasks/{id}`|Delete a task                   |
|`GET`   |`/stats`     |Get task statistics             |
|`GET`   |`/health`    |Health check                    |

-----

## 💡 Example API Usage

```python
import requests

# Create a task
res = requests.post("http://localhost:8000/tasks", json={
    "title": "Build portfolio project",
    "category": "Development",
    "priority": "high",
    "due": "2026-06-01"
})
task_id = res.json()["id"]

# Mark as done
requests.patch(f"http://localhost:8000/tasks/{task_id}", json={"done": True})

# Get stats
print(requests.get("http://localhost:8000/stats").json())
```

-----

## 🗺 Roadmap

- [ ] PostgreSQL persistent storage
- [ ] User authentication (JWT)
- [ ] Team collaboration & task assignment
- [ ] Email/push notifications for due dates
- [ ] Mobile app (React Native)
- [ ] Live deployment

-----

## 👤 Author

**Sylvester Francis**
Software Engineer & AI Developer — Lagos, Nigeria
📧 sylvafrancis6@gmail.com
🔗 [DocMind Project](https://github.com/sylvafrancis6-dotcom/docmind)

-----

## 📄 License

MIT License
