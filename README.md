# Next.js + TypeScript 기본 구조 세팅 프로젝트
> Next.js와 TypeScript를 기반으로 프론트엔드 프로젝트의 초기 구조를 세팅한 프로젝트입니다.

## 🔧 기술 스택
- Next.js, Typescript
- package : axios, jose, jsonwebtoken, moment, react-redux

## 💼 정리내용
- 기본 인증 플로우: 로그인 / 로그아웃
- 게시물 목록 조회 기능 구현
- SEO 최적화: 메타데이터 (title, description, Open Graph 등)
- 전역 Provider 설정: Redux, 인증, Axios 인터셉터
- API 구성 방식:  
  - BFF 구조의 `/api` 라우트  
  - SSR용 `fetchFilter`, CSR용 `axiosFilter` 분리
- Middleware 활용: 페이지 이동 및 API 요청 시 토큰 검사
