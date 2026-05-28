# GitHub 업로드 가이드

이 프로젝트는 GitHub에 바로 올릴 수 있도록 정리된 버전입니다.
`node_modules/`, `dist/`, `.env`는 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.

## 1. GitHub에서 새 Repository 만들기

1. GitHub 접속
2. New repository 클릭
3. Repository name 예시: `enhance-web-game`
4. Public/Private 선택
5. README, .gitignore, license는 GitHub에서 추가하지 말고 빈 저장소로 생성

## 2. CMD에서 프로젝트 폴더로 이동

```cmd
cd C:\Users\Playdata\Downloads\enhance-web-game-v0.9a-git-ready
```

폴더명이 다르면 실제 압축 푼 폴더명으로 바꿔주세요.

## 3. Git 초기화 및 첫 커밋

```cmd
git init
git add .
git commit -m "Initial deploy ready version"
```

## 4. GitHub 원격 저장소 연결

아래 주소는 본인 GitHub 저장소 주소로 바꿔서 실행하세요.

```cmd
git branch -M main
git remote add origin https://github.com/본인계정/enhance-web-game.git
git push -u origin main
```

## 5. 이후 수정 후 다시 올릴 때

```cmd
git add .
git commit -m "Update ranking page"
git push
```

## 로컬 실행

개발 서버는 5174번 포트를 사용합니다.

```cmd
pnpm install
pnpm dev --port 5174
```

접속:

```txt
http://localhost:5174/
```

같은 네트워크 테스트 서버는 5173번 포트를 사용합니다.

```cmd
pnpm dev --host 0.0.0.0 --port 5173
```

IPv4 확인:

```cmd
ipconfig
```

접속 예시:

```txt
http://내IPv4주소:5173/
```

## 배포 설정

Vite 정적 배포 기준:

```txt
Build Command: pnpm build
Output Directory: dist
```

pnpm이 배포 환경에서 안 잡히면 npm 기준으로도 가능합니다.

```txt
Build Command: npm install && npm run build
Output Directory: dist
```
