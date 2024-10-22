---
title: 'Go의 변수 선언'
date: '2024/10/18 22:00:00'
---

# 변수란

변수는 프로그램에서 사용되는 데이터를 저장하는 공간이다. Go 언어에서 변수는 다음과 같이 선언한다.

```go
func main() {
	var a int = 10 // 변수 선언
	var msg string = "Hello, World!" // 변수 선언

	a = 20 // 변수에 값 할당
	msg = "Hello, Go!" // 변수에 값 할당
	fmt.Println(a, msg) // 변수 출력 (20 Hello, Go!)
}
```

## 변수 선언

Go에서의 변수 선언은 다음과 같다.

```go
var a int = 10 // int형 변수 a를 선언하고 초기값으로 10을 할당한다
```

또한 변수의 재선언은 불가능하다.

```go
var msg string = "Hello, World!"

a = 20

var msg string = "Hello, Go!" // 에러 발생
```

일반적으로 `firstName` 같은 카멜 케이스를 사용하여 변수명을 작성한다.

## 변수 타입

Go 언어는 정적 타입 언어이다. 따라서 변수가 가질 크기를 결정하기 위해 변수를 선언할 때 타입을 지정해주어야 한다.
변수의 타입으로는 다음과 같은 것들이 있다.

### 숫자형

| 타입         | 설명                                               | 범위                                       |
| ------------ | -------------------------------------------------- | ------------------------------------------ |
| `unit8`      | 8비트(1Byte) 부호 없는 정수                        | 0 ~ 255                                    |
| `unit16`     | 16비트(2Byte) 부호 없는 정수                       | 0 ~ 65535                                  |
| `unit32`     | 32비트(4Byte) 부호 없는 정수                       | 0 ~ 4294967295                             |
| `unit64`     | 64비트(8Byte) 부호 없는 정수                       | 0 ~ 18446744073709551615                   |
| `int8`       | 8비트(1Byte) 부호 있는 정수                        | -128 ~ 127                                 |
| `int16`      | 16비트(2Byte) 부호 있는 정수                       | -32768 ~ 32767                             |
| `int32`      | 32비트(4Byte) 부호 있는 정수                       | -2147483648 ~ 2147483647                   |
| `int64`      | 64비트(8Byte) 부호 있는 정수                       | -9223372036854775808 ~ 9223372036854775807 |
| `float32`    | 32비트(4Byte) 부동 소수점                          | -3.4E+38 ~ 3.4E+38                         |
| `float64`    | 64비트(8Byte) 부동 소수점                          | -1.7E+308 ~ 1.7E+308                       |
| `complex64`  | 32비트(4Byte) 실수부와 허수부를 가지는 복소수      |                                            |
| `complex128` | 64비트(8Byte) 실수부와 허수부를 가지는 복소수      |                                            |
| `byte`       | 8비트(1Byte) 부호 없는 정수 (unit8과 동일)         | 0 ~ 255                                    |
| `rune`       | 32비트(4Byte) 유니코드 코드 포인트 (int32와 동일)  | 0 ~ 4294967295                             |
| `int`        | 32비트 환경에서는 int32, 64비트 환경에서는 int64   |                                            |
| `uint`       | 32비트 환경에서는 unit32, 64비트 환경에서는 unit64 |                                            |

### 문자열

문자열은 `string` 타입으로 선언한다.

```go
var msg string = "Hello, World!"
```

### 불리언

불리언은 `bool` 타입으로 선언한다.

```go
var isTrue bool = true
```

### 배열

배열은 `[]`를 사용하여 선언한다.

```go
var arr [5]int // int형 5개 요소를 가지는 배열 선언
```

이외에도 슬라이스, 포인터, 구조체 등등이 존재한다.

## 변수 선언 방법

변수를 선언하는 방법은 다음과 같다.

```go
var a int = 10 // 변수 선언

var b int // 변수 선언 (초기값을 할당하지 않은 경우, 타입별 기본값으로 초기화된다)

var c = 10 // 타입 생략 (컴파일러가 초기값을 보고 타입을 추론한다)

d := 10 // var 키워드를 생략하고 `:=`를 사용하여 변수를 선언할 수 있다
```

## 타입 변환

Go의 경우 강타입 언어이면서 그 중에서도 타입 검사가 엄격한 편이다. 연산이나 대입 시 타입이 다르면 에러가 발생한다.

```go
func main() {
	a := 3
	var b float64 = 3.5

	var c int = b // 에러 발생
	d := a * b // 에러 발생

	var e int64 = 7
	f := e * a // 에러 발생
}
```

같은 숫자형이라도 타입이 다르면 에러가 발생한다. 이때, 타입 변환을 통해 타입을 맞춰줄 수 있다.

```go
package main

import "fmt"

func main() {
	a := 3 // int
	var b float64 = 3.5 // float64

	var c int = int(b) // int, 3
	d := float64(a * c) // int 3 * int 3 = int 9 -> float64 9.0

	var e int64 = 7
	f := int64(d) * e // int64 9 * int64 7 = int64 63

	var g int = int(b * 3) // float64 3.5 * 3 = float64 10.5 -> int 10
	var h int = int(b) * 3 // int 3 * 3 = int 9
	fmt.Println(g, h, f) // 10 9 63
}
```

따라서 `int()`나 `float64()`와 같은 함수를 사용하여 타입 변환을 할 수 있다.
하지만 타입 변환 시 큰 타입에서 작은 타입으로 변환 시 데이터 손실이 발생할 수 있으므로 주의해야 한다.

```go
var i int16 = 3456
var j int8 = int8(i) // int16 3456 -> int8 -128

fmt.Println(i, j) // 3456 -128
```

이는 타입을 변환하면서 상위 비트를 잘라내기 때문에 발생한다.

## 스코프

변수의 스코프는 변수가 사용 가능한 범위를 의미한다. Go 언어에서는 블록 _{}_ 단위로 스코프가 결정된다.

```go
package main

import "fmt"

var global = "global"

func main() {
	var function = "function"

	{
		var block = "block"
		fmt.Println(global, function, block) // global function block
	}

	function = block + "scope" // undefined: block
}
```
