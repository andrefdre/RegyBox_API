# Dockerfile for Django (backend)
# Build the Django app
FROM python:3.9 AS backend

WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY backend/ ./

# Expose the port for Django
EXPOSE 8000

# Start the Django development server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# Dockerfile for React (frontend)
# Build the React app
FROM node:14 AS frontend

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./

# Start the React development server
CMD ["npm", "start"]

# Expose the port for React
EXPOSE 3000
