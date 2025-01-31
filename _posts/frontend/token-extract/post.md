---
title: '디자인 오픈소스로 디자인 시스템 따라 만들어보기 -디자인 토큰-'
description: '토큰을 통한 커뮤니케이션'
date: '2025/01/31'
tags: ['디자인 시스템', '원티드', '디자인 토큰', 'vanilla-extract']
---

# 개요

지난 포스팅에서는 디자인 시스템 라이브러리의 바탕이 되는 번들러와 각종 라이브러리를 세팅하는 방법을 알아보았다.

이번엔 디자인 시스템의 언어라고도 볼 수 있는 **디자인 토큰**에 대해 알아보고, 이를 추출하는 방법을 알아보려 한다.

# 디자인 토큰이란?

![원티드 디자인 시스템의 컬러 토큰 중 일부](1.png)

사용자에게 일관된 경험을 제공하는데에는 기술적인 부분만이 아닌 디자인 레벨에서 이뤄지는 통일성 또한 중요하다.

이러한 일관된 UX를 제공하기 위해서는 프로덕트 내에서 타이포그래피, 컬러, 레이아웃 등의 요소들을 규격화하여 프로덕트의 스타일을 구성할 수 있다. 이때, 규격화된 프로덕트의 유닛들은 곧 디자인 시스템의 단위이자 가장 작은 요소가 되는 **디자인 토큰**이 된다.

디자인 토큰을 바탕으로 어플리케이션의 디자인을 구축해나가면 규격 외의 디자인이 나오는 케이스를 방지하여 일관성 있고 정형화된 톤앤 매너를 가진 퀄리티 높은 디자인을 구축할 수 있다. 디자인 토큰은 이러한 프로덕트의 톤앤 매너를 규격화하는 것 뿐만 아니라 개발자와 디자이너의 커뮤니케이션을 돕는 역할도 한다.

예를 들어 디자인 토큰이 없는 경우에는 다음과 같은 상황이 발생할 수 있다.

> 디자이너: 프로덕트 내에 존재하는 `#32a852` 색상을 전체적으로 톤 다운시켜서 `#317844`으로 수정했어요.

이때 프론트엔드 개발자는 프로젝트 내에 존재하는 모든 `#32a852` 색상을 찾아서 `#317844`로 수정해야 한다. 커뮤니케이션 과정에서도 Hex 코드를 사용하여 수정사항을 공유하다 보니 직관적이지 않다는 단점 또한 존재한다. 그리고 만약 프로젝트에 동일한 색상이지만 표기법이 다른 `rgba`나 `hsl` 같은 표기법으로 작성된 코드가 존재한다면, 의도치 않은 변경사항 누락이 발생할 가능성 또한 존재한다.

만약 디자인 토큰이 존재한다면 위의 문제는 다음과 같이 해결된다.

> 프로덕트 내에 존재하는 `#32a852` 색상을 전체적으로 톤 다운시켜서 `#317844`으로 수정했어요.
>
> -> 컬러 토큰 중에 **`Green500`** 의 값을 좀 더 어둡게 `#317844`로 수정했어요.

이러한 수정사항을 반영할 경우 프론트엔드 개발자는 컬러 토큰 변수에 할당 된 값 단 하나만 수정하면 해당 컬러 토큰 변수를 참조하는 프로젝트 내 모든 색상이 일괄적으로 수정된다. 또한 색상 표기법에 비해 비교적 직관적인 커뮤니케이션이 가능하다. 또한 자주 사용하는 컬러들을 시맨틱 컬러로 분류하여 더욱 명시적으로 표현할 수 있고, 다양한 테마에서의 대응 또한 용이하다.

# Token Studio

디자인 토큰을 관리하는 법은 개발적인 부분에서는 `emotion`이나 `tailwind`나 `vanilla-extract` 같은 라이브러리 별로 가지각색이지만, 디자인의 경우 피그마에선 주로 `Variables`를 사용하여 관리한다.

프로그래밍에서 변수를 통해 값을 관리하는 것처럼, 피그마에서도 `Variable`을 통해 색상, 타이포그래피, 레이아웃 등을 관리한다고 이해할 수 있다.

그렇다면 이제 개발자의 일은 디자인 시스템에서 관리하는 `Variable`을 추출하여 프로젝트에 적용하는 것이다.

이때 피그마에서 제공하는 `Token Studio`를 사용하여 간단하게 토큰의 동기화를 이뤄낼 수 있다.

![Token Studio](2.png)

**Token Studio**는 Figma에서 디자인 토큰을 생성, 관리, 배포할 수 있도록 도와주는 플러그인이다. 또한 프로젝트에서 설정된 토큰을 JSON 형태로 추출할 수 있도록 도와준다.

# JSON을 토큰으로

원티드 디자인 시스템의 컬러 토큰을 추출하면 대략 다음과 같은 형태의 JSON 파일이 생성된다.

```json
// 팔레트 토큰
{
  "Common": {
    "0": {
      "value": "#000000",
      "type": "color"
    },
    "100": {
      "value": "#ffffff",
      "type": "color"
    }
  },
  "Neutral": {
    "5": {
      "value": "#0f0f0f",
      "type": "color"
    },
    "10": {
      "value": "#171717",
      "type": "color"
    },
    "15": {
      "value": "#1c1c1c",
      "type": "color"
    },
    "20": {
      "value": "#2a2a2a",
      "type": "color"
    },

    //...
}

// Semantic Light 토큰
{
  "Primary": {
    "Normal": {
      "value": "{Blue.50}",
      "type": "color"
    },
    "Strong": {
      "value": "{Blue.45}",
      "type": "color"
    },
    "Heavy": {
      "value": "{Blue.40}",
      "type": "color"
    }
  },
  "Label": {
    "Normal": {
      "value": "{Cool Neutral.10}",
      "type": "color"
    },
    "Strong": {
      "value": "{Common.0}",
      "type": "color"
    }
  },
  //...
}

// Semantic Dark 토큰
{
  "Primary": {
    "Normal": {
      "value": "{Blue.60}",
      "type": "color"
    },
    "Strong": {
      "value": "{Blue.55}",
      "type": "color"
    },
    "Heavy": {
      "value": "{Blue.50}",
      "type": "color"
    }
  },
  "Label": {
    "Normal": {
      "value": "{Cool Neutral.99}",
      "type": "color"
    },
    "Strong": {
      "value": "{Common.100}",
      "type": "color"
    },
  }

  //...
}
```

이제 이런 JSON 기반 토큰을 [Style Dictionary](https://styledictionary.com/)를 통해 CSS, SCSS, TypeScript 등의 언어로 변환할 수 있다. 혹은 직접 만들어도 된다.

이번 포스팅의 경우 `Style Dictionary`를 사용하는 대신 직접 스크립트를 구현하여 토큰을 추출하는 방법을 사용해보려 한다. 왜냐하면 `Style Dictionary`를 적용하였을때 Transform에서 HEX 코드의 Alpha 값을 추출하는 과정에서 이슈가 있었기 때문이다.

## 직접 만들기

```json
// 팔레트 토큰
{
  "Common": {
    "0": {
      "value": "#000000",
      "type": "color"
    },
    "100": {
      "value": "#ffffff",
      "type": "color"
    },
    //...
  }
}

// Semantic Light 토큰
{
  "Label": {
    "Strong": {
      "value": "{Common.0}", // 팔레트 토큰의 키를 참조
      "type": "color"
    },
    //...
  }
}

// Semantic Dark 토큰
{
  "Label": {
    "Strong": {
      "value": "{Common.100}", // 팔레트 토큰의 키를 참조
      "type": "color"
    },
    //...
  }
}
```

우선 위에서 본 JSON과 같이 색상 팔레트의 경우 정해진 값이 존재하지만, Semantic 컬러의 경우 라이트 테마, 다크 테마에 따라 팔레트 JSON의 키를 참조하는 것을 확인할 수 있다.

첫번째로 이러한 키를 참조하는 토큰을 팔레트로부터 값을 가져와 치환하는 스크립트를 작성해보자.

## 팔레트 토큰 치환

```js
// src/scripts/utils.js

import fs from 'fs'

export function resolveReferences(obj, palette) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        resolveReferences(obj[key], palette)
      } else if (
        typeof obj[key] === 'string' &&
        obj[key].startsWith('{') &&
        obj[key].endsWith('}')
      ) {
        const refPath = obj[key].slice(1, -1).split('.')
        let value = palette
        for (const ref of refPath) {
          value = value[ref]
        }
        obj[key] = value.value
      }
    }
  }
}

export function parseJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

export function writeJSON(path, json) {
  fs.writeFileSync(path, JSON.stringify(json, null, 2), 'utf-8')
}
```

코드를 설명하자면 JSON 관련 함수들은 말 그대로 JSON 파일을 읽고 쓰는 역할을 하며, `resolveReferences` 함수는 팔레트 토큰의 키를 참조하는 토큰을 팔레트 토큰의 값으로 치환하는 역할을 한다. `parseJSON`을 통해 읽어온 JSON Object를 재귀를 통해 순회하며 탐색하며 두번째 인자로 받은 Palette Object의 값으로 변환한다.

이제 이 함수를 실행할 script 파일을 작성해보자.

```js
// src/scripts/merge.js
import { parseJSON, resolveReferences, writeJSON } from './utils.js'

const PALETTE_JSON_FILE_PATH = 'src/json/Palette.json'
const palette = parseJSON(PALETTE_JSON_FILE_PATH)

const light = parseJSON('src/json/Light.json')
const dark = parseJSON('src/json/Dark.json')

resolveReferences(light, palette)
resolveReferences(dark, palette)

writeJSON('src/json/Light.json', light)
writeJSON('src/json/Dark.json', dark)
```

이제 이 스크립트를 실행하면 팔레트 토큰의 값을 참조하는 토큰이 팔레트 토큰의 값으로 치환되며 기존의 JSON을 덮어씌우게 된다. `package.json`에 다음과 같이 스크립트를 추가해주면 쉽게 실행할 수 있다.

```json
// package.json
{
  "scripts": {
    "merge": "node src/scripts/merge.js"
  }
}
```

**변경된 JSON**

```json
// src/json/Light.json
{
  "Primary": {
    "Normal": {
      "value": "#0066ff", // 팔레트 토큰의 키의 값
      "type": "color"
    },
    "Strong": {
      "value": "#005eeb",
      "type": "color"
    },
    "Heavy": {
      "value": "#0054d1",
      "type": "color"
    }
  }
  //...
}
```

## JSON To TypeScript

우리가 사용하는 `vanilla-extract`는 TypeScript 기반의 라이브러리이다. 따라서 JSON을 Typescript 변수로 변환하는 스크립트를 작성해보자.

```js
// src/scripts/generate.js
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()

const toPascalCase = (str) => {
  return str
    .replace(/[_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^[a-z]/, (chr) => chr.toUpperCase())
}

const generateTypeScript = (json, parentKey = '') => {
  let tsContent = ''

  for (const [key, value] of Object.entries(json)) {
    const pascalKey = parentKey
      ? `${parentKey}${toPascalCase(key)}`
      : toPascalCase(key)

    if (value.type === 'size') {
      tsContent += `export const ${pascalKey.replaceAll('.', 'dot')} = '${value.value}';\n`
    }

    if (value.type === 'color') {
      // For color type, generate export statement
      tsContent += `export const ${pascalKey} = '${value.value}';\n`
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recurse if the value is an object
      tsContent += generateTypeScript(value, pascalKey)
    }
  }

  return tsContent
}

function generate(inputFilePath, outputFilePath) {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the input file:', err)
      return
    }

    try {
      const jsonData = JSON.parse(data)
      const tsContent = generateTypeScript(jsonData)

      if (outputFilePath === 'size.ts') {
        console.log('tsContent')
        console.log(jsonData)
      }

      fs.writeFile(
        path.resolve(__dirname, 'src/variables', outputFilePath),
        tsContent,
        'utf8',
        (err) => {
          if (err) {
            console.error('Error writing the output file:', err)
            return
          }

          console.log(
            'TypeScript file generated successfully at:',
            outputFilePath,
          )
        },
      )
    } catch (err) {
      console.error('Error parsing JSON:', err)
    }
  })
}

generate(path.resolve(__dirname, 'src/json/Palette.json'), 'palette.ts')
generate(path.resolve(__dirname, 'src/json/Light.json'), 'light.ts')
generate(path.resolve(__dirname, 'src/json/Dark.json'), 'dark.ts')
generate(path.resolve(__dirname, 'src/json/Size.json'), 'size.ts')
```

코드의 흐름은 다음과 같다.

1. Token JSON 파일을 읽어온다.
2. 각 토큰의 값들을 `const` 변수로 변환하여 출력한다.
3. 출력된 변수들을 TypeScript 파일로 저장한다.

이 또한 `package.json`에 다음과 같이 스크립트를 추가해주면 쉽게 실행할 수 있다.

```json
// package.json
{
  "scripts": {
    "generate": "node src/scripts/generate.js"
  }
}
```

생성된 TypeScript 파일은 다음과 같다.

```ts
// src/variables/palette.ts
export const Common0 = '#000000'
export const Common100 = '#ffffff'
export const Neutral5 = '#0f0f0f'
export const Neutral10 = '#171717'
export const Neutral15 = '#1c1c1c'
export const Neutral20 = '#2a2a2a'
export const Neutral22 = '#303030'
export const Neutral30 = '#474747'
export const Neutral40 = '#5c5c5c'
export const Neutral50 = '#737373'
//...

// src/variables/light.ts
// export const PrimaryNormal = '#3385ff';
export const PrimaryStrong = '#1a75ff'
export const PrimaryHeavy = '#0066ff'
export const LabelNormal = '#f7f7f8'
export const LabelStrong = '#ffffff'
export const LabelNeutral = '#c2c4c8e0'
//...

// src/variables/dark.ts
// export const PrimaryNormal = '#0066ff';
export const PrimaryStrong = '#005eeb'
export const PrimaryHeavy = '#0054d1'
export const LabelNormal = '#171719'
export const LabelStrong = '#000000'
export const LabelNeutral = '#2e2f33e0'
//...
```

# vanilla-extract에 통합하기

이제 이러한 토큰을 `vanilla-extract`에 통합해보자. `vanilla-extract`는 CSS 변수를 생성하는 방법으로 여러 API를 제공하는데, 이번엔 SSR 환경이나 vanilla-extract가 아닌 환경에서도 사용하기 쉬운
[createGlobalTheme API](https://vanilla-extract.style/documentation/global-api/create-global-theme/)를 활용하여 구축해보자.

`createGlobalTheme` API는 첫번째 인자로 입력된 CSS 셀렉터를 스코프로 설정하여 CSS 변수를 설정하고, css 변수를 JS 변수로 추출하는 역할을 한다. 또한 [createGlobalThemeContract API](https://vanilla-extract.style/documentation/global-api/create-global-theme-contract/)를 통해 디자인 토큰에 대한 구현체를 생성하기 이전에 디자인 토큰에 대한 스키마를 미리 정의하여, 테마에 따른 동일한 토큰을 생성하여 여러 테마를 대응하는데 좋은 DX를 제공한다.

방법은 간단하다. `index.css.ts` 파일에서 다음과 같이 작성해주면 된다.

```ts
// src/index.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme,
} from '@vanilla-extract/css'
import { lightColors, darkColors, paletteColors } from '@repo/design-tokens'

function generateContract<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).map(([key]) => [key, key])) as T
}

const semanticContract = generateContract(lightColors)
const paletteContract = generateContract(paletteColors)

export const DARK_MODE_CLASS_NAME = 'dark-mode'

function prefix(value: string | null) {
  return `WDS-${value}`
}

export const semanticVars = createGlobalThemeContract(semanticContract, prefix)
export const paletteVars = createGlobalThemeContract(paletteContract, prefix)

createGlobalTheme('body', semanticVars, lightColors)
createGlobalTheme(`body.${DARK_MODE_CLASS_NAME}`, semanticVars, darkColors)
createGlobalTheme('body', paletteVars, paletteColors)

export type SemanticColor = keyof typeof semanticVars
export type PaletteColor = keyof typeof paletteVars
export type Color = SemanticColor | PaletteColor
```

우선 `generateContract` 함수를 통해 Contract를 구성할 Object를 생성한다. `vanilla-extract`에서 CSS 변수 스키마의 기준이 되는 Contract Object는 Hex 코드 같은 값을 기본값으로 설정할 수 없기 때문에 값을 키와 동일하게 수정하는 작업을 진행한다.

이후 `semanticContract`와 `paletteContract`를 통해 각각의 Contract를 생성하고, `createGlobalThemeContract`를 통해 각각의 토큰을 스키마로 정의한다. 이제 VE 내부에서는 `createGlobalThemeContract`가 반환한 값에 대해 다음과 같이 사용할 수 있다.

```ts
const box = style({
  backgroundColor: semanticVars.PrimaryStrong,
})
```

이는 컴파일 시 다음과 같은 CSS로 변환된다.

```css
.box {
  background-color: var(--WDS-Primary-Strong);
}
```

이제 스키마의 조건을 충족하는 구현체를 설정한다. 방법은 간단하다. 애초에 Contract 자체가 토큰을 기반으로 재구성된 Object이니 이를 그대로 사용하면 된다.

```ts
// src/index.css.ts
createGlobalTheme('body', semanticVars, lightColors)
createGlobalTheme(`body.${DARK_MODE_CLASS_NAME}`, semanticVars, darkColors)
createGlobalTheme('body', paletteVars, paletteColors)
```

이제 실제 프로젝트에서 `body` 태그에 `dark-mode` 클래스를 추가하면 다크 테마에 대한 토큰이 적용되는 것을 확인할 수 있다.

# Reference

- [원티드 디자인 라이브러리](https://www.figma.com/community/file/1355516515676178246)
- [vanilla-extract](https://vanilla-extract.style/)
