FROM python:3.9.12

RUN pip3 install django

WORKDIR /usr/src/app

COPY . .

# WORKDIR ./noraehey

RUN pip install --upgrade pip # pip 업그레이드
RUN pip install -r requirements.txt # 필수 패키지 설치

EXPOSE 8000  
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "--noreload"]
