---
title: '디자인 오픈소스로 디자인 시스템 따라 만들어보기 -프로젝트 세팅-'
description: '라이브러리와 번들러 세팅하기'
date: '2025/01/22'
tags: ['디자인 시스템', '원티드', 'Rollup', 'vanilla-extract']
---

# 개요

![원티드 디자인 라이브러리](3.png)

얼마전에 회사 프로젝트를 진행하면서 영감을 좀 얻고자 피그마 커뮤니티를 둘러보던 중, [원티드에서 공개한 한 프로젝트](https://www.figma.com/community/file/1355516515676178246)를 발견했다. 원티드에서 사내 프로덕트에 사용하는 디자인 시스템을 공개한 프로젝트였다.

사실 국내 IT 기업 중에 기술적으로 테크 커뮤니티에 기여하며 오픈소스를 공개하는 기업들은 꽤 많지만, 생각보다 피그마를 통해 디자인 오픈소스를 공개하는 기업은 많지 않다. 국내에서 또다른 기업으로는 리디가 있고, 해외의 경우 우버가 존재한다.

마침 요근래 번들러에 대한 공부가 필요하다고 생각하기도 헀었기에, 한번 원티드의 디자인 시스템을 따라 만들어보며 좀 더 흥미롭게 공부해보고자 했다. _라이센스가 CC BY 4.0 였던 것도 어느정도 영향이 있었다_

# 디자인 시스템이란?

> "원티드 디자인 라이브러리는 원티드에서 활발히 사용하고 있는 디자인 시스템 요소들을 포함하고 있습니다."
>
> _-원티드 디자인 라이브러리 소개문 중 발췌_

사실 디자인 시스템에는 단순히 UI 구성요소를 모아두는 것 뿐만이 아니다. 디자인 시스템은 조직이 추구하는 브랜드 가치와 UX에 대한 가이드라인까지, 조직의 생산자들을 위한 영양가 있는 기준들을 제공한다.

이름에는 **디자인**이 들어가지만, 사실 디자인 시스템의 경우 개발자들 또한 구현하면서 여러가지 고민을 해야 한다. 컴포넌트들의 인터랙션을 시스템이 추구하는 방향으로 맞춰 나가고, Primitive한 로직들에 대한 추상화 등, 디자인의 확장에 대한 유연한 반응을 위해 많은 커뮤니케이션이 필요하다.

어찌보자면, 지금 따라 만드는건 디자인 시스템이라기보단 **스타일 가이드**에 더 가깝다고 볼 수 있지만, 한 기업의 디자인 시스템을 따라 만들어보는 것 자체가 디자인 시스템을 이해하는 좋은 방법이라고 생각한다.

# 기술 스택 선택

우선 React를 위한 컴포넌트 라이브러리를 만들기 위해 정해야 할 기술 스택을 크게 보자면 **번들러, 스타일링**이 있다.

![미래 세대를 위한 ESM 번들러, Rollup](1.png)

우선 번들러의 경우는 **Rollup**을 사용했다.

번들러의 경우 **Webpack, esbuild, tsup** 등 여러 번들러가 있지만, Rollup을 선택했다. 다른 번들러들과 비교하였을떄, 트리 쉐이킹이 강력하고, ESM, CJS를 동시에 지원 가능하며 output에 대한 커스터마이징이 용이하다는 점이 매력적이었다.
esbuild 또한 고려하였지만, 컴포넌트 라이브러리의 특성상 빌드 시간 보다는 트리 쉐이킹을 통한 배포크기 최적화가 더 중요하다고 생각하여 Rollup을 선택했다.

![제로 런타임을 위한 스타일링, vanilla-extract](2.png)

CSS 스타일링의 경우는 **vanilla-extract**를 사용했다.

사실 프론트엔드 개발자에게 CSS야 말로 머리가 아플정도로 선택지가 다양하게 주어지며, 각자의 진영이 주장도 무수히 많다. 어떤 프론트엔드 개발자는 CSS-in-JS를 주장하고, 어떤 프론트엔드 개발자는 CSS-in-CSS를 주장한다.
그 중에서도 어떤 개발자는 `styled-component`를 찬양하며, 또다른 누군가는 `tailwind`를 숭배한다.

다만, 라이브러리를 구현하는 입장에서는 라이브러리를 사용하는 개발자의 환경을 우선적으로 고려해야 한다. 어떤 어플리케이션은 `Next.js`를 통한 SSR 기반 리액트를 구축할 수도 있고, 또다른 어플리케이션은 CSR 리액트를 구축할 수도 있다.
또한, 어플리케이션마다 각각 사용하는 스타일링 라이브러리 & 프레임워크 또한 다를 것이다.

이러한 점을 생각했을때, 아직 서버 사이드 렌더링 환경에서 사용할때 조금 불안정하다고 느낀 `styled-component`나 `emotion`은 제외하였다.
추가적으로 `tailwind`의 경우에는 유틸리티 클래스를 통한 개발이 컴포넌트 라이브러리 개발과는 조금 맞지 않는다고 생각하였다.

결론적으로 제로 런타임이며, `recipe`를 통해 `cva`를 대체할 수 있는 `vanilla-extract`를 선택했다.
사실 이전에 진행한 프로젝트에서 디자인 시스템을 구축할 때, `vanilla-extract`를 사용해본 경험이 있었고, DX가 좋아서 선택한 점도 있다.

# 프로젝트 세팅

## Turborepo

우선 패키지 분리를 위해 **Turborepo**를 사용했다.
굳이 Turborepo로 패키지를 여러가지로 나눈 이유는 디자인 토큰 또한 패키지화를 목표로 하였기 때문이기도 하고, 실제 어플리케이션 샘플을 만들기도 편하기 때문이다.

```bash
pnpm dlx create-turbo@latest
```

Turborepo와 궁합이 좋은 `pnpm`을 통해 모노레포를 구축한다.

추후 패키지 구성은 다음과 같을 예정이다.

```bash
apps/
  next-sample/ # Next.js Consumer 샘플
  react-sample/ # React Consumer 샘플
packages/
  design-system/ # 디자인 시스템
  design-tokens/ # 디자인 토큰
  eslint-config/ # 공통 ESLINT 설정
```

## ESLINT & Prettier

ESLint와 Prettier의 경우 개인적으로 선호하는 트리플의 [@titicaca/eslint-config-triple](https://github.com/titicacadev/triple-config-kit)을 사용했다.

## TypeScript

프로젝트 구성 준비과 완료되었다면 `design-system` 패키지의 초기 세팅을 진행한다.

```bash
npm init -y
```

우선 npm init을 통해 패키지를 초기화한다. 또한, `TypeScript`를 사용하기 위해 설치 후 `tsconfig.json`을 생성한다.

```bash
pnpm install --save-dev typescript
```

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationDir": "dist",
    "emitDeclarationOnly": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals"]
  },
  "include": [
    "src",
    ".storybook",
    "vite.config.ts",
    "vitest.config.ts",
    "src/**/*.stories.tsx",
    "setupTests.ts",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": ["node_modules", "dist"]
}
```

## Rollup

이후 `rollup` 관련 패키지를 설치한다.

```bash
pnpm i --save-dev rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript rollup-plugin-terser rollup-plugin-peer-deps-external rollup-plugin-filesize @rollup/plugin-alias
```

각각의 패키지들의 역할을 설명하자면 다음과 같다.

- `rollup`: 번들링을 위한 메인 패키지
- `@rollup/plugin-node-resolve`: `node_modules` 디렉토리 내의 서브파티 모듈을 번들링 시키는 플러그인
- `@rollup/plugin-commonjs`: `CommonJS`로 작성된 npm 패키지를 ES6로 변환하는 플러그인
- `@rollup/plugin-typescript`: TypeScript 컴파일 및 타입 선언 파일 생성을 위한 플러그인
- `rollup-plugin-terser`: 번들 파일을 최적화하는 플러그인
- `rollup-plugin-peer-deps-external`: `peerDependencies`로 지정된 패키지를 외부 모듈로 처리하여 번들 결과물에서 제거하는 플러그인
- `rollup-plugin-filesize`: 번들 파일 크기를 출력하는 플러그인
- `@rollup/plugin-alias`: 파일 경로를 별칭으로 처리하는 플러그인

이제 트랜스파일링을 위한 `babel` 플러그인을 설치한다.

```bash
pnpm install --save-dev @babel/core @babel/preset-env @babel/preset-react
```

각 패키지의 역할은 다음과 같다.

- `@babel/core`: Babel의 핵심 패키지
- `@babel/preset-env`: ES6+ 문법을 ES5로 변환하는 프리셋
- `@babel/preset-react`: React 관련 코드 변환을 위한 프리셋

이후 `rollup.config.js`를 생성하여 다음과 같이 설정한다.

```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import filesize from 'rollup-plugin-filesize'
import path from 'path'
import alias from '@rollup/plugin-alias'
import { fileURLToPath } from 'url'
import babel from '@rollup/plugin-babel'

// SSR 환경에서 사용하기 위한 "use client" 추가 플러그인
function addUseClient() {
  return {
    name: 'add-use-client',
    renderChunk(code) {
      return `"use client";\n${code}`
    },
  }
}

export default {
  input: 'src/index.ts',
  output: [
    {
      // CommonJS 출력을 위한 설정
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      // ES Module 출력을 위한 설정
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.join(__dirname, './src') }],
    }), // 파일 경로 별칭 처리
    peerDepsExternal(),
    resolve(), // node_modules 확인
    commonjs(), // CommonJS 변환
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }), // 타입스크립트 변환 및 타입 선언 파일 생성
    terser(), // 코드 압축
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }), // Babel 트랜스파일링
    filesize(), // 번들 파일 크기 출력
    addUseClient(), // "use client" 추가
  ],
}
```

참고로 `terser` 플러그인의 경우 `use client`를 제거하기 때문에 반드시 `addUseClient` 이전에 존재해야 한다.

## Vanilla Extract

이제 스타일링을 위한 `vanilla-extract`를 설치한다.

```bash
pnpm install --save-dev @vanilla-extract/css @vanilla-extract/recipes @vanilla-extract/sprinkles @vanilla-extract/rollup-plugin
```

이후 `vanilla-extract`에 대한 번들러 플러그인을 추가한다.

```js
export default {
  input: 'src/index.ts', // 진입점
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs', // CommonJS 출력
      exports: 'auto',
      assetFileNames: mergeStyles,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm', // ES Module 출력
      assetFileNames: mergeStyles,
    },
  ],
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.join(__dirname, './src') }],
    }),
    peerDepsExternal(),
    resolve(), // node_modules 확인
    commonjs(), // CommonJS 변환
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      exclude: [
        'node_modules',
        '**/*.stories.css.ts',
        '**/*.stories.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
    }), // 타입스크립트 변환
    vanillaExtractPlugin(), // vanilla-extract 플러그인
    terser(), // 코드 압축
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    filesize(), // 번들 파일 크기 출력
    addUseClient(), // "use client" 추가
  ],
}
```

# Reference

- [원티드 디자인 라이브러리](https://www.figma.com/community/file/1355516515676178246)
- [vanilla-extract](https://vanilla-extract.style/)
- [rollup](https://rollupjs.org/)
