FROM node:20-alpine AS builder

WORKDIR /app

# 환경변수 설정
ENV NODE_ENV=production

# package.json 및 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# Next.js 앱 빌드
COPY . .
RUN npm run build

# 실행 환경 설정
FROM node:20-alpine AS runner

WORKDIR /app

# 빌드된 파일 복사
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static

# Public 폴더 복사
COPY --from=builder /app/public ./public

# 포트 설정
EXPOSE 3000

# 실행 명령어
CMD ["node", "server.js"]