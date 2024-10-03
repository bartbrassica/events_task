FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV FLASK_APP=app.py

WORKDIR /backend

COPY requirements.txt /backend/

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /backend

EXPOSE 5000

RUN chmod u+x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

