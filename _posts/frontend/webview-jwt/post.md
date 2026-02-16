---
title: 'Next.js 웹뷰 환경에서 안정적으로 JWT 사용하기'
description: '네이티브, SSR, CSR에서 모두 사용 가능한 JWT'
date: '2026/02/18'
tags: ['Next.js', 'Webview', 'React Native', 'JWT']
---

# 개요

요근래, 사실은 꽤 오래전부터 많은 애플리케이션들이 웹뷰를 사용하여 서비스를 개발하고 있다. 웹 애플리케이션 자체를 앱으로 래핑하는 [캐치테이블](https://app.catchtable.co.kr)처럼 전면 웹뷰로 구성된 앱도 있고, 쇼핑이나 증권 같은 특정 탭에서만 웹뷰를 활용하는 토스, 커뮤니티에 웹뷰를 쓰는 당근처럼 일부 피처에만 웹뷰를 도입한 앱들도 존재한다.

기업들이 웹뷰 기반 애플리케이션을 채택하는 이유는 여러 가지다. 앱 심사 없이 배포할 수 있어 릴리즈 주기를 유연하게 가져갈 수 있고, 웹과 앱 코드를 공유하여 개발 효율을 높일 수 있으며, 상대적으로 넓은 인재풀을 활용할 수 있다는 점이 대표적이다. 물론 그에 따른 트레이드오프로 호스팅 비용이 발생하고, 저성능 기기에서 퍼포먼스가 저하될 수 있다는 단점도 존재한다.

이외에도 웹뷰 기반 네이티브 애플리케이션을 구축하면, 기존 브라우저 환경의 웹 애플리케이션과는 달리 네이티브 레이어와 통신하기 위한 브리지를 구현해야 한다. 여기에 서버 사이드 렌더링(SSR)이 더해지면 고려해야 할 부분이 더욱 늘어난다. 이번 포스트에서는 SSR 환경의 웹뷰에서 JWT를 안정적으로 관리하는 방법을 직접 구현하며 알아보고자 한다.

# 토큰 관리 구조

JWT에는 Access Token과 Refresh Token, 두 가지가 존재한다. Access Token은 짧은 유효 기간을 가지며, 만료되면 Refresh Token을 사용해 새로운 Access Token을 발급받는다. 이 구조는 토큰 탈취 시 피해 범위를 최소화하기 위해 고안된 것으로, 이미 잘 알려진 패턴이다.

## 저장소 선택

기존 웹 전용 또는 네이티브 전용 환경에서는 토큰을 주로 다음 위치에 저장한다.

- **네이티브 저장소** (Preferences, Keychain, Secure Storage 등)
- **LocalStorage**
- **SessionStorage**
- **Cookies**

그렇다면 웹뷰 환경에서는 어디에 저장해야 할까? 우선 인증이 필요한 요청이 발생하는 시나리오를 정리해보자.

1. 네이티브에서 요청하는 경우
2. 웹뷰 서버 사이드에서 요청하는 경우
3. 웹뷰 클라이언트 사이드에서 요청하는 경우

저장소별로 각 시나리오를 따져보겠다.

**네이티브 저장소**

디바이스와 앱 메타데이터에 묶여 영속적으로 데이터를 저장한다. 보안 측면에서 가장 우수하며, 네이티브 요청에는 최적이다. 다만 서버 사이드 환경에서는 접근이 불가능하다. 브리지를 통한 토큰 접근은 클라이언트 사이드에서 JS 번들이 로드된 이후에야 가능하기 때문이다.

**LocalStorage**

네이티브 환경과 서버 사이드 모두 접근 불가하고, 보안 측면에서도 취약하다. 웹뷰 환경에서는 적합하지 않다.

**SessionStorage**

브라우저 세션 동안만 유지되므로 JWT가 추구하는 방향과 맞지 않는다. LocalStorage와 동일한 접근 제약도 존재한다.

**Cookies**

쿠키는 네이티브에서 직접 접근하기는 어렵지만, 서버 사이드에서는 요청 헤더를 통해 자연스럽게 접근할 수 있다. `httpOnly` 옵션을 사용하면 XSS 공격에 대한 보호도 된다.

## 구조 결정

이를 종합하면 **네이티브 저장소를 Source of Truth로 두고, 웹뷰 쿠키와 동기화**하는 구조가 가장 현실적이다.

- 네이티브 요청: 스토리지에서 직접 토큰을 읽어 사용
- 서버 사이드 요청: 쿠키에서 토큰을 읽어 사용
- 클라이언트 사이드 요청: 브리지를 통해 토큰을 가져와 사용

쿠키 동기화에는 `react-native-nitro-cookies`를 사용한다. 토큰이 갱신될 때마다 해당 라이브러리를 통해 웹뷰 도메인의 쿠키를 업데이트해주는 방식이다.

이 구조로 대응 가능한 전체 시나리오를 정리하면 다음과 같다.

| 시나리오                      | 처리 방법                                    |
| ----------------------------- | -------------------------------------------- |
| 네이티브 - 정상 요청          | 스토리지의 Access Token으로 요청             |
| 네이티브 - 토큰 만료          | Refresh Token으로 재발급 후 재요청           |
| 서버 사이드 - 정상 요청       | 쿠키의 Access Token으로 요청                 |
| 서버 사이드 - 토큰 만료       | 에러 페이지 표시 후 브리지로 인스턴스 리로드 |
| 클라이언트 사이드 - 정상 요청 | 브리지로 Access Token을 가져와 요청          |
| 클라이언트 사이드 - 토큰 만료 | 브리지로 토큰 리프레시 후 재요청             |

여기에 Access Token 만료 시간 직전에 주기적으로 토큰을 갱신하는 인터벌을 추가하면 대부분의 인증 요청을 안정적으로 커버할 수 있다.

# 직접 구현해보기

실제 프로젝트 코드는 [이곳](https://github.com/cobocho/ssr-webview-jwt)에서 확인할 수 있다.

샘플 프로젝트의 기술 스택과 정책은 다음과 같다.

- **서버**: Hono.js
- **모바일 네이티브**: Expo Development Build, react-native-nitro-cookies, webview-bridge
- **웹뷰**: Next.js (App Router), webview-bridge

토큰 유효 기간 정책은 Access Token 1시간, Refresh Token 14일로 설정한다. 쿠키에 저장할 때는 `httpOnly` 옵션을 사용한다.

## 서버 구현

`jose` 라이브러리를 사용해 JWT 서명과 검증 유틸을 작성한다. Access Token과 Refresh Token은 각각 별도의 시크릿 키로 분리하여 서명한다.

```ts
// apps/server/src/lib/jwt.ts
import { type JWTPayload, jwtVerify, SignJWT } from 'jose'

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? 'access-secret-change-in-production',
)
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? 'refresh-secret-change-in-production',
)

export const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 // 1 hour
export const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 14 // 14 days

export async function signAccessToken(sub: string): Promise<string> {
  return new SignJWT({ sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_EXPIRES_IN}s`)
    .sign(ACCESS_SECRET)
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET)
  return payload as TokenPayload
}

// ...
```

인증 라우트는 `/login`과 `/refresh` 두 개를 구현한다. `/refresh`는 `Authorization` 헤더의 Bearer 토큰과 쿠키 두 방식을 모두 지원한다. 네이티브는 헤더를, 웹뷰는 쿠키를 통해 각자의 방식으로 접근할 수 있다.

```ts
// apps/server/src/routes/auth.ts
auth.post('/refresh', async (c) => {
  const authHeader = c.req.header('Authorization')
  let token: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    token = getCookie(c, 'refresh-token')
  }

  if (!token) {
    return c.json({ message: 'Refresh token not found' }, 401)
  }

  try {
    const payload = await verifyRefreshToken(token)
    const [newAccessToken, newRefreshToken] = await Promise.all([
      signAccessToken(payload.sub),
      signRefreshToken(payload.sub),
    ])

    c.header(
      'Set-Cookie',
      `refresh-token=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${REFRESH_TOKEN_EXPIRES_IN}; SameSite=Strict`,
    )

    return c.json(buildTokenResponse(newAccessToken, newRefreshToken))
  } catch {
    return c.json({ message: 'Invalid or expired refresh token' }, 401)
  }
})
```

보호된 API 라우트에는 인증 미들웨어를 붙인다. Access Token이 없거나 검증에 실패하면 401을 반환한다.

```ts
// apps/server/src/middleware/auth.ts
export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ message: 'Authorization header missing' }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verifyAccessToken(token)
    c.set('userId', payload.sub)
    await next()
  } catch {
    return c.json({ message: 'Invalid or expired access token' }, 401)
  }
})
```

## 네이티브 구현

### 토큰 리프레시 함수

네이티브에서 공통으로 사용할 리프레시 함수를 먼저 작성한다. SecureStore에서 Refresh Token을 꺼내 서버에 요청하고, 새 토큰 쌍을 반환한다.

```ts
// apps/mobile/src/lib/http.ts
export const getRefreshToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken')
  if (!refreshToken) return null

  try {
    const response = await ky
      .post(`${BASE_URL}/refresh`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
        retry: 0,
      })
      .json<{
        accessToken: string
        accessTokenExpiresIn: number
        refreshToken: string
        refreshTokenExpiresIn: number
      }>()

    SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)

    return {
      accessToken: response.accessToken,
      accessTokenExpiresAt: response.accessTokenExpiresIn,
      refreshToken: response.refreshToken,
      refreshTokenExpiresAt: response.refreshTokenExpiresIn,
    }
  } catch (error) {
    console.error('Token refresh failed', error)
    return null
  }
}
```

### 브리지 구현

웹뷰와의 통신에 사용할 브리지를 `@webview-bridge/react-native`로 작성한다. 브리지는 웹뷰 측에서 호출 가능한 네이티브 함수들을 정의하는 계층이다.

한 가지 중요한 설계 포인트가 있다. Access Token은 **SecureStore가 아닌 브리지의 메모리 상태**로만 관리한다. 앱이 종료되면 사라지는 휘발성 데이터로 취급하는 것이다. 어차피 앱 재시작 시 bootstrap 과정에서 Refresh Token으로 새 Access Token을 발급받으므로 영속 저장소에 저장할 필요가 없다. 반면 Refresh Token은 앱 재시작 후에도 유지되어야 하므로 SecureStore에만 저장한다.

```ts
// apps/mobile/src/lib/bridge.ts
export const appBridge = bridge<AppBridgeState>(({ get, set }) => {
  return {
    token: null,
    getAccessToken: async () => {
      const accessToken = get().token?.accessToken
      if (!accessToken) return null
      const decoded = jwtDecode<JWTPayload>(accessToken)
      return { accessToken, accessTokenExpiresAt: decoded.exp }
    },
    getRefreshToken: async () => {
      const refreshToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
      )
      if (!refreshToken) return null
      const decoded = jwtDecode<JWTPayload>(refreshToken)
      return { refreshToken, refreshTokenExpiresAt: decoded.exp }
    },
    setToken: async (token) => {
      const decodedAccess = jwtDecode<JWTPayload>(token.accessToken)
      const decodedRefresh = jwtDecode<JWTPayload>(token.refreshToken)
      SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token.refreshToken)
      set({
        token: {
          accessToken: token.accessToken,
          accessTokenExpiresAt: decodedAccess.exp,
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: decodedRefresh.exp,
        },
      })
    },
    refreshToken: async () => {
      const response = await getRefreshToken()
      if (!response) return null
      SecureStore.setItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
        response.refreshToken,
      )
      set({ token: { ...response } })
      return response
    },
    clearToken: async () => {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN)
    },
    logout: async () => {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN)
      set({ token: null })
      router.replace('/login')
    },
    navigateTo: async (path, options) => {
      router.push(path, options)
    },
    goBack: async () => {
      router.back()
    },
  }
})
```

브리지에 `navigateTo`와 `goBack`을 추가하면 웹뷰 내부에서 네이티브 라우터를 직접 제어할 수 있다. 예를 들어 웹뷰의 포스트 상세 페이지에서 뒤로 가기 버튼을 누르면 네이티브 스택의 이전 화면으로 이동하는 식이다.

### HTTP 클라이언트 구현

네이티브의 HTTP 클라이언트는 모든 요청에 브리지에서 Access Token을 꺼내 `Authorization` 헤더에 자동으로 삽입한다. 401 응답을 받으면 토큰을 갱신하고 요청을 재시도한다.

동시에 여러 요청이 401을 받았을 때 리프레시 요청이 중복 발생하지 않도록 `refreshPromise`로 진행 중인 리프레시 결과를 공유한다.

```ts
// apps/mobile/src/lib/http.ts
let refreshPromise: Promise<TokenResponse | null> | null = null

export const httpClient = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await appBridge.getState().getAccessToken()
        if (!token) return
        request.headers.set('Authorization', `Bearer ${token.accessToken}`)
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return response
        // 이미 재시도한 요청이면 무한 루프 방지
        if (request.headers.get('X-Retry')) return response

        const refreshToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
        )
        if (!refreshToken) return response

        if (!refreshPromise) {
          refreshPromise = getRefreshToken().finally(() => {
            refreshPromise = null
          })
        }

        const newToken = await refreshPromise
        if (!newToken) return response

        await appBridge.getState().setToken({
          accessToken: newToken.accessToken,
          refreshToken: newToken.refreshToken,
        })

        const newRequest = new Request(request, {
          headers: new Headers(request.headers),
        })
        newRequest.headers.set(
          'Authorization',
          `Bearer ${newToken.accessToken}`,
        )
        newRequest.headers.set('X-Retry', 'true')
        return ky(newRequest, { ...options, retry: 0 })
      },
    ],
  },
})
```

`X-Retry` 헤더는 재시도 요청임을 표시하는 플래그다. 재시도한 요청이 또 401을 받더라도 더 이상 리프레시를 시도하지 않고 응답을 그대로 반환해 무한 루프를 방지한다.

### AuthProvider 구현

`AuthProvider`는 앱 전체의 인증 생명주기를 관리하는 핵심 컴포넌트다. 담당하는 역할은 크게 네 가지다.

**1. 앱 시작 시 Bootstrap**

앱이 최초 실행될 때 SecureStore에서 Refresh Token을 확인한다. 토큰이 있으면 즉시 리프레시를 시도해 새 Access Token을 발급받고 웹뷰 쿠키와 동기화한다. 토큰이 없거나 리프레시에 실패하면 세션을 초기화한다.

`hasBootstrapped` ref를 사용해 Strict Mode 등 환경에서 bootstrap이 두 번 실행되는 것을 방지한다. bootstrap이 완료되면 `initialized`를 `true`로 변경하고, `RootLayout`에서 SplashScreen을 닫는다.

```ts
// apps/mobile/app/_layout.tsx
function RootStack() {
  const { initialized, isAuthenticated } = useAuth();

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  if (!initialized) return null;

  return (
    <Stack initialRouteName={isAuthenticated ? '(auth)' : 'login'}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
```

**2. 주기적 토큰 갱신**

```ts
export const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 // 1 hour
const REFRESH_INTERVAL_MS = ACCESS_TOKEN_EXPIRATION_TIME - 1000 // 만료 1초 전
```

Access Token 만료 1초 전에 갱신을 트리거하는 인터벌을 실행한다. 갱신 실패 시 `MAX_REFRESH_RETRIES`(2회)까지 재시도하고, 서버에서 401/403을 반환하면 재시도 없이 즉시 세션을 종료한다.

앱이 백그라운드로 전환되면 인터벌을 멈추고, 포어그라운드로 돌아오면 즉시 갱신 후 인터벌을 재시작한다. 백그라운드에서는 타이머가 정상적으로 동작하지 않아 토큰이 만료될 수 있기 때문이다.

**3. 쿠키 동기화**

브리지의 토큰 상태가 변경될 때마다 `react-native-nitro-cookies`를 통해 웹뷰 도메인의 쿠키를 업데이트한다. 함께 `Platform` 쿠키도 심어두면 웹뷰에서 현재 실행 중인 플랫폼(iOS/Android)을 파악하는 데 활용할 수 있다.

```ts
async function syncCookies(token: TokenResponse): Promise<void> {
  await Promise.all([
    NitroCookies.set(
      WEBVIEW_BASE_URL,
      {
        name: 'accessToken',
        value: token.accessToken,
        path: '/',
        expires: new Date(token.accessTokenExpiresAt).toUTCString(),
        secure: false,
        httpOnly: true, // JS에서 직접 접근 불가
      },
      true,
    ),
    NitroCookies.set(WEBVIEW_BASE_URL, {
      name: 'Platform',
      value: Platform.OS,
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString(),
      secure: false,
      httpOnly: false, // 웹뷰 JS에서 읽기 가능
    }),
  ])
}
```

`accessToken`은 `httpOnly: true`로 설정해 웹뷰의 JavaScript에서 직접 읽지 못하게 막는다. `Platform` 쿠키는 `httpOnly: false`로 두어 웹뷰 코드에서 UA 파싱 없이 플랫폼을 바로 읽을 수 있게 한다.

`skipNextSyncRef`는 이미 `applyToken`을 통해 동기화를 완료한 직후 `useEffect`가 다시 `syncCookies`를 중복 호출하는 것을 방지한다.

**4. 로그아웃**

인터벌을 중단하고 SecureStore의 Refresh Token을 삭제하며, 브리지의 토큰 상태를 초기화하고 웹뷰 쿠키도 지운다.

```ts
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setToken, getRefreshToken, clearToken } = useBridge(
    appBridge,
    (state) => ({
      token: state.token,
      setToken: state.setToken,
      clearToken: state.clearToken,
      getRefreshToken: state.getRefreshToken,
    }),
  )

  const [initialized, setInitialized] = useState(false)
  const isAuthenticated = useMemo(
    () => !!(token?.accessToken && token?.refreshToken),
    [token?.accessToken, token?.refreshToken],
  )

  // bootstrap: 앱 최초 실행 시 토큰 복원
  useEffect(
    function bootstrap() {
      if (hasBootstrapped.current) return
      hasBootstrapped.current = true
      ;(async () => {
        try {
          const storedRefreshToken = await getRefreshToken()
          if (!storedRefreshToken) {
            setInitialized(true)
            return
          }

          const refreshedToken = await refreshTokenWithRetry()
          if (refreshedToken) {
            skipNextSyncRef.current = true
            await applyToken(refreshedToken, setToken)
            startRefreshInterval()
          } else {
            await clearSession()
          }
        } catch {
          await clearSession()
        } finally {
          setInitialized(true)
        }
      })()
    },
    [setToken, clearSession, getRefreshToken, startRefreshInterval],
  )

  // 앱 포어그라운드 복귀 시 즉시 갱신
  useEffect(
    function handleAppState() {
      const subscription = AppState.addEventListener('change', (nextState) => {
        if (nextState === 'active' && isAuthenticated) {
          performRefresh().then(() => startRefreshInterval())
        } else if (nextState !== 'active') {
          stopRefreshInterval()
        }
      })
      return () => subscription.remove()
    },
    [
      isAuthenticated,
      performRefresh,
      startRefreshInterval,
      stopRefreshInterval,
    ],
  )

  // 토큰 변경 시 웹뷰 쿠키 동기화
  useEffect(
    function syncWebViewCookies() {
      if (!initialized) return
      if (skipNextSyncRef.current) {
        skipNextSyncRef.current = false
        return
      }

      ;(async () => {
        if (!token?.accessToken || !token?.refreshToken) {
          await clearSession()
          return
        }
        await syncCookies(token)
      })()
    },
    [initialized, token, clearSession],
  )

  // ...
}
```

### BridgedWebView

bootstrap이 완료되어 `initialized`가 `true`가 되기 전까지는 웹뷰를 마운트하지 않는다. 쿠키 동기화가 끝나지 않은 상태에서 웹뷰가 로드되면 서버 사이드 요청이 빈 쿠키로 날아가 인증 오류가 발생하기 때문이다.

```ts
// apps/mobile/src/components/bridged-webview.tsx
export function BridgedWebView({ uri, ...props }: BridgedWebViewProps) {
  const { initialized } = useAuth();
  const [key, setKey] = useState(0);

  if (!initialized) return null;

  return (
    <WebView
      key={key}
      source={{ uri }}
      sharedCookiesEnabled={true}
      thirdPartyCookiesEnabled={true}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'reload') setKey((k) => k + 1);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }}
      onContentProcessDidTerminate={() => webviewRef.current?.reload()} // iOS 크래시 복구
      onRenderProcessGone={() => { setKey((k) => k + 1); return true; }} // Android 크래시 복구
      {...props}
    />
  );
}
```

`key`를 변경하면 WebView 컴포넌트가 완전히 언마운트 후 재마운트된다. 서버 사이드 렌더링 중 인증 오류가 발생했을 때, 토큰을 갱신한 후 이 방식으로 웹뷰를 재시작하면 갱신된 쿠키로 페이지를 처음부터 다시 로드할 수 있다. `onContentProcessDidTerminate`와 `onRenderProcessGone`은 각각 iOS, Android에서 웹뷰 프로세스가 비정상 종료될 때의 복구 처리다.

## 웹뷰(Next.js) 구현

### 서버 사이드 HTTP 클라이언트

서버 사이드에서는 `next/headers`의 `cookies()`로 쿠키를 읽어 Access Token을 `Authorization` 헤더에 삽입한다. `throwHttpErrors: false`로 설정한 뒤 `afterResponse` 훅에서 HTTP 상태 코드를 커스텀 에러 클래스로 변환해 던진다. 에러 클래스의 `name` 속성이 클라이언트의 `error.tsx`에서 에러 종류를 식별하는 데 사용된다.

```ts
// apps/webview/src/lib/server-http.ts
export const serverHttp = ky.create({
  prefixUrl: SERVER_BASE_URL,
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')
        if (accessToken?.value) {
          request.headers.set('Authorization', `Bearer ${accessToken.value}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status >= 400) {
          const res = (await response.json()) as { message: string }
          switch (response.status) {
            case 400:
              throw new BadRequestError(res.message)
            case 401:
              throw new UnauthorizedError(res.message)
            case 403:
              throw new ForbiddenError(res.message)
            default:
              throw new InternalServerError(res.message)
          }
        }
        return response
      },
    ],
  },
})
```

서버 컴포넌트에서 `UnauthorizedError`가 throw되면 Next.js가 가장 가까운 `error.tsx`를 렌더링한다. 에러 컴포넌트는 `error.name`을 보고 `UnauthorizedError`일 때만 Retry 버튼을 표시한다. 버튼을 클릭하면 브리지의 `refreshToken`을 호출하고, 완료 후 네이티브에 `reload` 메시지를 전송한다.

```ts
// apps/webview/src/app/post/[id]/error.tsx
export default function PostDetailError({ error }: ErrorProps) {
  const refreshToken = useBridgeStore((state) => state.refreshToken);

  const reset = async () => {
    await refreshToken();
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'reload' }));
  };

  return (
    <div>
      <p>{error.message}</p>
      {error.name === 'UnauthorizedError' && (
        <button onClick={reset}>Retry</button>
      )}
    </div>
  );
}
```

네이티브가 `reload` 메시지를 받으면 `BridgedWebView`의 `key`를 변경해 웹뷰를 재마운트한다. 이 시점에는 갱신된 토큰이 쿠키에 반영된 상태이므로 서버 사이드 요청이 성공한다.

### 클라이언트 사이드 HTTP 클라이언트

클라이언트 사이드에서는 `httpOnly` 쿠키를 JavaScript로 읽을 수 없으므로 브리지를 통해 Access Token을 가져온다. 401 시 동일하게 `refreshPromise`로 리프레시 중복을 방지하고 원래 요청을 재시도한다.

```ts
// apps/webview/src/lib/client-http.ts
'use client'

let refreshPromise: Promise<string> | null = null

export const clientHttp = ky.create({
  prefixUrl: CLIENT_BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        // SSR 환경 방어: 브리지는 브라우저에서만 동작한다
        if (typeof window === 'undefined') return

        const token = await bridge.getAccessToken()
        if (!request.headers.get('Authorization') && token?.accessToken) {
          request.headers.set('Authorization', `Bearer ${token.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (typeof window === 'undefined') return
        if (response.status !== 401) return response

        if (!refreshPromise) {
          refreshPromise = bridge
            .refreshToken()
            .then((refreshedToken) => {
              if (!refreshedToken) throw new Error('Failed to refresh token')
              return refreshedToken.accessToken
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        const newAccessToken = await refreshPromise
        const newRequest = new Request(request, {
          headers: new Headers(request.headers),
        })
        newRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
        return ky(newRequest, { ...options, retry: 0 })
      },
    ],
  },
})
```

`typeof window === 'undefined'` 체크는 `'use client'` 컴포넌트라도 SSR 시 서버에서 한 번 실행될 수 있기 때문에 필요하다. 브리지 객체는 브라우저 환경에서만 존재하므로 이 방어 코드가 없으면 서버에서 런타임 에러가 발생한다.

### 서버 컴포넌트에서의 데이터 페칭

서버 컴포넌트에서는 `serverAPI`를 통해 React Query의 `prefetchQuery`로 데이터를 미리 가져오고, `HydrationBoundary`로 클라이언트에 전달한다. 클라이언트 컴포넌트에서는 `clientAPI`를 통해 데이터를 갱신한다.

```ts
// apps/webview/src/app/post/[id]/page.tsx
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // 서버에서 미리 가져오기 (쿠키의 Access Token 사용)
  await queryClient.fetchQuery({
    queryKey: ['post', id],
    queryFn: () => serverAPI.getPost(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PostDetailLoading />}>
        <PostDetail postId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
```

```ts
// apps/webview/src/components/post-detail.tsx (클라이언트 컴포넌트)
export function PostDetail({ postId }: PostDetailProps) {
  const goBack = useBridgeStore((state) => state.goBack);

  // 클라이언트에서 refetch 시에는 브리지의 Access Token 사용
  const { data } = useSuspenseQuery({
    queryKey: ['post', postId],
    queryFn: () => clientAPI.getPost(postId),
  });

  return (
    <div>
      <button onClick={() => goBack()}>← Back</button>
      {/* ... */}
    </div>
  );
}
```

뒤로 가기 버튼에서 `goBack()`을 브리지를 통해 호출하면 네이티브 라우터의 스택을 제어할 수 있다. 브라우저 히스토리가 아닌 네이티브 네비게이션을 타기 때문에 자연스러운 앱 UX를 유지할 수 있다.

# 전체 흐름 정리

구현한 내용의 전체 흐름을 시나리오별로 정리하면 다음과 같다.

**앱 시작**

1. `AuthProvider`의 bootstrap이 실행된다.
2. SecureStore에서 Refresh Token을 확인한다.
3. Refresh Token이 있으면 서버에서 새 Access Token을 발급받는다.
4. 발급받은 토큰을 브리지 메모리와 웹뷰 쿠키에 동기화한다.
5. `initialized`가 `true`가 되고 SplashScreen이 닫히며 웹뷰가 마운트된다.

**주기적 갱신**

1. Access Token 만료 1초 전, 인터벌이 `performRefresh`를 호출한다.
2. 갱신 성공 시 브리지 메모리와 웹뷰 쿠키를 업데이트한다.
3. 갱신 실패(401/403) 시 세션을 종료하고 로그인 화면으로 이동한다.

**서버 사이드 요청 중 토큰 만료**

1. `serverHttp`가 쿠키에서 Access Token을 읽어 요청을 보낸다.
2. 서버에서 401을 반환하면 `UnauthorizedError`가 throw된다.
3. Next.js의 `error.tsx`가 에러를 잡아 에러 UI와 Retry 버튼을 표시한다.
4. 사용자가 Retry 버튼을 클릭하면 브리지의 `refreshToken`을 호출한다.
5. 갱신 완료 후 `ReactNativeWebView.postMessage`로 `reload` 이벤트를 전송한다.
6. 네이티브가 웹뷰를 재마운트하고, 갱신된 쿠키로 서버 사이드 요청이 재시도된다.

**클라이언트 사이드 요청 중 토큰 만료**

1. `clientHttp`가 브리지에서 Access Token을 가져와 요청을 보낸다.
2. 서버에서 401을 반환하면 `afterResponse` 훅이 실행된다.
3. `refreshPromise`를 통해 중복 없이 단일 리프레시 요청이 진행된다.
4. 새 Access Token으로 원래 요청을 재시도한다.

# 마치며

웹뷰 기반 앱에서 SSR과 JWT를 함께 쓰는 것은 처음에는 복잡해 보인다. 하지만 핵심 원칙은 단순하다. **네이티브 저장소를 Source of Truth로 두고, 서버 사이드 접근을 위해 쿠키와 동기화한다.** 이 원칙 위에서 각 환경(네이티브, SSR, CSR)의 요청 경로를 분리하여 구현하면 전 시나리오를 안정적으로 커버할 수 있다.

한 가지 더 강조하고 싶은 부분은 **초기화 순서**다. 웹뷰가 로드되기 전에 반드시 토큰 동기화가 완료되어야 한다. 이를 놓치면 첫 번째 서버 사이드 렌더링이 항상 인증 실패로 끝나는 버그를 만나게 된다. `initialized` 플래그를 통해 bootstrap 완료 전에는 웹뷰를 렌더링하지 않는 구조가 이 문제를 해결한다.

프로덕션 환경에서 이 구조를 적용할 때는 추가적인 고려사항이 있다. 쿠키의 `secure` 옵션은 HTTPS 환경에서 `true`로 설정해야 하고, `SameSite` 정책도 운영 환경에 맞게 조정해야 한다. 또한 토큰 갱신 실패 시 사용자에게 명확한 피드백을 제공하는 UX도 빠뜨리지 않고 챙기면 좋다.
