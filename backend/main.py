from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

app = FastAPI(title=“TaskFlow API”, version=“1.0.0”)

app.add_middleware(
CORSMiddleware,
allow_origins=[“http://localhost:5173”, “http://localhost:3000”],
allow_credentials=True,
allow_methods=[”*”],
allow_headers=[”*”],
)

# In-memory store (replace with PostgreSQL in production)

tasks_db = {}

class TaskCreate(BaseModel):
title: str
category: str = “Work”
priority: str = “medium”  # low | medium | high
due: Optional[str] = None

class TaskUpdate(BaseModel):
title: Optional[str] = None
category: Optional[str] = None
priority: Optional[str] = None
due: Optional[str] = None
done: Optional[bool] = None

class Task(BaseModel):
id: str
title: str
category: str
priority: str
due: Optional[str]
done: bool
created_at: str

def make_task(data: TaskCreate) -> Task:
return Task(
id=str(uuid.uuid4()),
title=data.title,
category=data.category,
priority=data.priority,
due=data.due,
done=False,
created_at=datetime.utcnow().isoformat(),
)

@app.get(”/”)
def root():
return {“status”: “TaskFlow API running”, “version”: “1.0.0”}

@app.get(”/tasks”, response_model=List[Task])
def get_tasks(category: Optional[str] = None, priority: Optional[str] = None, done: Optional[bool] = None):
“”“Get all tasks with optional filters.”””
result = list(tasks_db.values())
if category:
result = [t for t in result if t.category == category]
if priority:
result = [t for t in result if t.priority == priority]
if done is not None:
result = [t for t in result if t.done == done]
return sorted(result, key=lambda t: t.created_at, reverse=True)

@app.post(”/tasks”, response_model=Task, status_code=201)
def create_task(data: TaskCreate):
“”“Create a new task.”””
task = make_task(data)
tasks_db[task.id] = task
return task

@app.get(”/tasks/{task_id}”, response_model=Task)
def get_task(task_id: str):
“”“Get a single task by ID.”””
if task_id not in tasks_db:
raise HTTPException(status_code=404, detail=“Task not found.”)
return tasks_db[task_id]

@app.patch(”/tasks/{task_id}”, response_model=Task)
def update_task(task_id: str, data: TaskUpdate):
“”“Update a task partially.”””
if task_id not in tasks_db:
raise HTTPException(status_code=404, detail=“Task not found.”)
task = tasks_db[task_id].dict()
updates = data.dict(exclude_unset=True)
task.update(updates)
tasks_db[task_id] = Task(**task)
return tasks_db[task_id]

@app.delete(”/tasks/{task_id}”)
def delete_task(task_id: str):
“”“Delete a task.”””
if task_id not in tasks_db:
raise HTTPException(status_code=404, detail=“Task not found.”)
del tasks_db[task_id]
return {“message”: “Task deleted.”}

@app.get(”/stats”)
def get_stats():
“”“Get task statistics.”””
all_tasks = list(tasks_db.values())
return {
“total”: len(all_tasks),
“done”: sum(1 for t in all_tasks if t.done),
“pending”: sum(1 for t in all_tasks if not t.done),
“high_priority”: sum(1 for t in all_tasks if t.priority == “high” and not t.done),
}

@app.get(”/health”)
def health():
return {“status”: “healthy”}
