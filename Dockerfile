# Dockerfile for Django (backend)
# Build the Django app
FROM python:3.8 AS backend

WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY backend/ ./

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

# Expose the port for Django
EXPOSE 8000

# Start the Django development server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# Dockerfile for React (frontend)
# Build the React app
FROM node:18 AS frontend

WORKDIR /app

COPY frontend/package.json ./

RUN npm install

COPY frontend/ ./

# Start the React development server
CMD ["npm", "run" , "start"]

# Expose the port for React
EXPOSE 3000
