FROM python:3

WORKDIR /app

# Install dependencies
COPY ../backend/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Expose port
EXPOSE 5000

# Use flask for dev
# TODO - change to gunicorn before prod
CMD ["flask", "run", "--host=0.0.0.0"]