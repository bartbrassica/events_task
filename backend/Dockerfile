FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV FLASK_APP=app.py

WORKDIR /backend

COPY requirements.txt /backend/

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /backend

EXPOSE 5000

CMD ["bash", "-c", "flask db upgrade && flask run --host=0.0.0.0 --port=5000"]
