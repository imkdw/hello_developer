# [ Hello Developer ] 개발자를 위한 커뮤니티 서비스

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/logo.svg" width="200px" height="100px">

웹개발에 있어 개발 사이클의 전반적인 흐름을 경험하기 위해 진행한 개인 프로젝트 입니다.

실제 서비스는 [헬로디벨로퍼](https://hdev.site) 에서 사용이 가능합니다.

<br/>

# 🎨 Enviroment

### 에디터

- Visual Studio Code
- DBeaver
- Mysql Workbench

### 디자인

- Figma

### ETC

- Notion
  <br/>
  <br/>

# 🔨 Tech Skills

## 🖥 백엔드

### 언어 / 프레임워크

- Typescript
- Nestjs

### 데이터베이스

- Mysql + TypeORM

### 인프라

- AWS EC2
- AWS S3
- AWS ACM
- AWS Route53
- AWS ELB(ALB)
- AWS RDS
- AWS ECR
- Docker

### 인증

- Passport.js

<br/>

## 💻 프론트엔드

### 언어 / 라이브러리

- Typescript
- React

### 상태관리

- Recoil

### 디자인

- Styled-components

### 인프라

- AWS S3
- AWS CloudFront
- AWS Route53
  <br/>

## 🔑 ETC

- CI/CD : Github Actions
- Markdown Editor/Viewer : Toast UI Editor
  <br/>
  <br/>

# ✍Database E-R Diagram

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/erd.png">
  <br/>
  <br/>

# 🌐 System Architecture

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/server+infra.png">

## 배포 방식

### EC2에서 Docker를 활용하여 배포하였습니다.

### AWS ACM에서 발급받은 SSL인증서를 사용하여 ELB(ALB)를 통해 HTTPS를 적용했습니다.

<br/>

<br/>

## CI/CD

### Github Actions를 사용하여 Docker Image를 빌드하고 ECR에 업로드 합니다.

### EC2에서는 ECR에 업로드된 이미지를 받아오고 Docker Image를 실행하여 배포합니다.

<br/>
<br/>

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/client+infra.png">

## 배포 방식

### S3의 정적 웹 호스팅을 사용하여 CloudFront로 배포했습니다.

### AWS ACM에서 SSL인증서를 발급받아 HTTPS를 적용했습니다.

### 배포과정은 아래 블로그에 정리했습니다.

- [1. S3 웹호스팅](https://iamiet.tistory.com/entry/AWS%EC%97%90-React-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-1-S3-%EC%9B%B9%ED%98%B8%EC%8A%A4%ED%8C%85-%EC%84%A4%EC%A0%95)
- [2. Route53 및 ACM 설정](https://iamiet.tistory.com/entry/AWS%EC%97%90-React-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-2-Route53-%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%97%B0%EA%B2%B0-%EB%B0%8F-SSL-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%B0%9C%EA%B8%89)
- [3. CloudFront 배포](https://iamiet.tistory.com/entry/AWS%EC%97%90-React-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-3-CloudFront-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
- [4. Route53 레코드 매핑](https://iamiet.tistory.com/entry/AWS%EC%97%90-React-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-4-CloudFront-Route53-%EC%82%AC%EC%84%A4%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0)

<br/>

## CI/CD

### Github Actions를 사용하여 리액트 프로젝트 빌드이후 S3에 업로드됩니다.

### S3의 변경사항이 바로 적용될 수 있도록 CloudFront에서 Invalidate Cache를 적용했습니다.

<br/>

### CI/CD 구축과정은 아래 블로그에 정리했습니다.

- [React CI/CD 구축과정](https://iamiet.tistory.com/entry/S3%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%9C-React%EC%97%90-CICD-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-with-Github-Actions)

<br/>
<br/>

# ✔ Test

## Unit Test

### 각 API의 Controller와 Service 레이어에 대한 90개의 유닛테스트 케이스를 작성했습니다.

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/unit-test-result.png">

### 상위 레이어에 의존하는 로직의 경우 테스트의 격리를 위하여 Mocking 처리했습니다.

### 유닛테스트의 경우 Auth, User 등과 같이 모듈별로 폴더에 존재합니다.

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/unit-test-structure.png">
<br/>
<br/>

## E2E Test

### 모든 API에 대한 65개의 통합테스트 케이스를 작성했습니다.

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/e2e-test-result.png">

### 테스트시간을 줄기이 위하여 실제 DB가 아닌 인-메모리 DB인 SQLite를 사용했습니다.

### 통합테스트의 경우 루트폴더 하위 test 폴더에 존재합니다.

<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/e2e-test-structure.png">
<br/>
<br/>

# 📜 API Docs with Swagger

### Restful API의 문서를 자동으로 구성해주는 Swagger 프레임워크를 사용해서 작성했습니다.

### API 문서 URL : [Hello Developer API Docs.](https://api.hdev.site:5000/api)

<br/>
<img src="https://s3.ap-northeast-2.amazonaws.com/dongwoo.personal/swagger.png">

<br/>
<br/>

# ❗ 해결했던 문제들..

## 이미지 업로드 최적화하기

에디터를 통해 이미지 업로드 및 DB에 저장시 아래와 같은 상황이 발생했습니다.

- 마크다운 에디터에서 이미지 삽입시 인코딩되어 본문의 길이가 길어지는 상황
- 약 4kb의 이미지 삽입시 약 5100자의 문자열이 삽입
- 본문의 길이가 늘어날수록 DB에서 차지하는 공간이 커지게되며, 삽입/삭제 등 데이터의 크기가 늘어날수록 더 많은양의 네트워크 트래픽을 요구

이미지 업로드 이벤트를 커스텀하여 AWS S3에 업로드 및 이미지 URL을 반환하여 업로드를 최적화 했습니다.

해결과정은 [Tistory 블로그](https://iamiet.tistory.com/entry/toast-ui-editor-v3-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%EC%B5%9C%EC%A0%81%ED%99%94%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%A7%88%EC%9D%B4%EC%A7%95%ED%95%98%EA%B8%B0)에 정리했습니다.
<br/>
<br/>

## 회원가입시 이메일 인증 구현하기

nodemailer + gmail을 사용하여 이메일 인증을 구현중 아래 문제가 발생했습니다.

- 2022.05.30 이후 OAuth2.0 미사용시 Gmail API 사용 불가
- 공식문서에서는 OAuth 사용방법과 관련된 자세한 방법이 나와있지 않았음

위 제약사항으로 인해 Gmail API의 OAuth와 nodemailer를 사용하여 인증메일 발송기능을 구현했습니다.

해결과정은 [Tistory 블로그](https://iamiet.tistory.com/entry/Nodemailer-Gmail-OAuth20%EC%9C%BC%EB%A1%9C-%EC%9D%B4%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)에 정리했습니다.
<br/>
<br/>
