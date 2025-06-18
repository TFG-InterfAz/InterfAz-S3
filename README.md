# InterfAz - Fullstack Web Application

This repository contains a complete fullstack web application built with:

- **Backend**: Django (Python)
- **Frontend**: React with Next.js

---

## 📁 Project Structure

```plaintext
InterfAz/
├── backend/       # Django backend (API, models, views)
└── frontend/      # React frontend (Next.js, Axios, Toastify)
```

---

## ⚙️ Requirements

Make sure the following are installed:

- Python 3.10+
- Node.js 18+
- npm or yarn
- Conda or virtualenv (for Python environment)

---

## ⚙️ Backend Setup (Django)

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create and activate a virtual environment

Using Conda:

```bash
conda create -n interfaz python=3.10
conda activate interfaz
```

### 3. Install dependencies

If a `requirements.txt` file exists:

```bash
pip install -r requirements.txt
```

Or install manually:

```bash
pip install django djangorestframework django-cors-headers
```

### 4. Apply migrations and start the server

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Your backend will now be running at: `http://localhost:8000`

---

## 🎨 Frontend Setup (React + Next.js)

### 1. Navigate to the frontend folder

```bash
cd ../frontend
```

### 2. Install dependencies

```bash
npm install
```

If you are missing libraries:

```bash
npm install axios react-toastify
```

### 3. Start the development server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 🔗 API Communication

- Django serves APIs at `http://localhost:8000`
- React uses Axios to send requests to Django
- CSRF and CORS must be properly configured for secure communication

### 🔧 Django Settings (`settings.py`):

```python
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000'
]
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'corsheaders',
    ...
]
```

Make sure middleware includes:

```python
'corsheaders.middleware.CorsMiddleware',
'django.middleware.csrf.CsrfViewMiddleware',
```

---

## 📦 Key Dependencies

### Backend

- `Django`
- `djangorestframework`
- `django-cors-headers`

### Frontend

- `React`
- `Next.js`
- `axios`
- `react-toastify`

---

## 📊 Development Notes

- React runs on localhost and port 3000
- Django runs on localhost and port 8000
- Make sure you are using the correct virtual environment for Django
- Static files and templates can be configured using Django's `TEMPLATES` and `STATICFILES_DIRS`

---

## 👨‍💻 Authors

**Your Name**  
Project for Academic Use  
GitHub: [ivaramlar](https://github.com/ivaramlar)
GitHub: [fracalrod3](https://github.com/fracalrod3)


---

## 📎 Useful Commands

```bash
# Backend
python manage.py runserver
python manage.py makemigrations
python manage.py migrate

# Frontend
npm run dev
npm install <package-name>
```

---
