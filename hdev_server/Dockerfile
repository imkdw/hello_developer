# docker의 이미지를 정의, 해당 프로젝트에서 node 16 버전을 사용
FROM node:16

# /app 이라는 폴더에서 프로젝트를 실행할 예정이므로 mkdir 명령어로 폴더를 생성
RUN mkdir -p /app

# /app 이라는 폴더에서 프로젝트를 실행
WORKDIR /app

# Dockerfile이 위치한 폴더의 모든 내용을 /app으로 복사
COPY . .

# 프로젝트에서 사용한 패키지를 package.json 을 통하여 모두 설치
RUN npm install

# 프로젝트를 빌드
RUN npm run build

# 프로젝트에서 5000번 포트를 사용한다는 의미
EXPOSE 5000

# 빌드 이후에 dist라는 폴더에 main.js가 생성되므로 해당 파일을 실행
CMD [ "node", "dist/main.js" ]