# Install dependencies and build app
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# 의존성 관련 파일 복사 및 설치
COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY . .
RUN pnpm build

# 런타임 컨테이너 설정
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# package.json 필요 시 복사
COPY --from=builder /app/package.json ./

# Next.js standalone 모드로 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
