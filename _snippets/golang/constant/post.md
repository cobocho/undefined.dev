---
title: 'Go의 상수'
date: '2024/10/19 13:00:00'
---

# 상수 정의

상수란 변하지 않는 값으로, Go 언어에서는 `const` 키워드를 사용하여 상수를 정의한다. 상수는 다음과 같이 정의한다. 상수를 변경하려고 하면 컴파일 에러가 발생한다.

```go
package main

import "fmt"

const Pi = 3.14

func main() {
	fmt.Println(Pi)

	Pi = 3.14159 // 컴파일 에러
}
```

# Iota

만약 상수를 Enum으로 사용하고 싶다면, `iota`를 사용할 수 있다. `iota`는 상수를 0부터 1씩 증가시키는 열거자로 사용된다. `iota`는 상수 블록에서만 사용할 수 있다.

```go
package main

import "fmt"

const (
	Apple = iota // 0
	Banana = iota // 1
	Cherry = iota // 2
)

func main() {
	fmt.Println(Apple, Banana, Cherry) // 0 1 2
}
```

혹은 다음과 같이 사용할 수도 있다.

```go
package main

import "fmt"

const (
	Apple = iota // 0
	Banana // 1
	Cherry // 2
)

func main() {
	fmt.Println(Apple, Banana, Cherry) // 0 1 2
}
```

# 타입이 없는 상수

Go 언어에서는 타입이 없는 상수를 사용할 수 있다. 타입이 없는 상수는 변수에 할당할 때 타입이 지정된다. 따라서 여러 타입에 사용할 수 있다.

```go
package main

import "fmt"

const PI = 3.14 // untyped constant
const FloatPI float32 = 3.14

func main() {
	var a int = PI * 100
	var b int = FloatPI * 100 // 에러 발생

	fmt.Println("a =", a)
	fmt.Println("b =", b)
}
```

# 상수 리터럴

Go는 상수를 컴파일 타임에 실제 결과값 리터럴로 대체한다. 따라서 비교적 CPU 자원을 적게 사용한다.

```go
const PI = 3.14
var a int = PI * 100
```

이 코드는 다음과 같이 컴파일된다.

```go
var a int = 314
```
