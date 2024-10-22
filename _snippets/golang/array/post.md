---
title: 'Go의 배열'
date: '2024/10/21 20:00:00'
---

# Go의 배열

배열은 동일한 타입의 데이터를 연속된 메모리 공간에 저장하는 자료구조이다. Go 언어에서 배열은 다음과 같이 정의한다.

```go
package main

import "fmt"

func main() {
	var t [5]float64 = [5]float64{24.0, 25.9, 26.0, 27.0, 28.0} // float64형 5개 요소를 가지는 배열 선언

	for i := 0; i < len(t); i++ {
		fmt.Println(t[i]) // 배열 요소 출력
	}
}
```

만약 값을 지정하지 않고 배열을 선언하면, 각 요소는 타입별 기본값으로 초기화된다.

```go
package main

import "fmt"

func main() {
  var t [5]float64 // float64형 5개 요소를 가지는 배열 선언

  for i := 0; i < len(t); i++ {
    fmt.Println(t[i]) // 배열 요소 출력
  }

  // 출력 결과
  // 0
  // 0
  // 0
  // 0
  // 0
}
```

배열 선언시 개수는 항상 상수로 지정해야 한다.

```go
package main

const CONSTANT = 3

func main() {
	v := 5
	a := [v]int{1, 2, 3, 4, 5} // 에러 발생
	b := [CONSTANT]int{1, 2, 3} // 정상

	var c [10]int // 정상
}

```

# range

배열을 순회할 때는 `range` 키워드를 사용한다.

```go
package main

import "fmt"

func main() {
  t := [5]float64{24.0, 25.9, 26.0, 27.0, 28.0} // float64형 5개 요소를 가지는 배열 선언

  for i, v := range t {
    fmt.Println(i, v) // 배열 요소 출력
  }
}
```

# 배열 복사

배열을 복사할 때는 `=` 연산자를 사용한다.

```go
package main

import "fmt"

func main() {
  a := [5]int{1, 2, 3, 4, 5}
  b := a // 배열 복사

  fmt.Println(a) // [1 2 3 4 5]
  fmt.Println(b) // [1 2 3 4 5]

  b[0] = 10 // b의 첫 번째 요소를 변경

  fmt.Println(a) // [1 2 3 4 5]
  fmt.Println(b) // [10 2 3 4 5]
}
```

만약 복사한 배열의 타입이 다르다면, 컴파일 에러가 발생한다.

```go
package main

import "fmt"

func main() {
  a := [5]int{1, 2, 3, 4, 5}
  var b [5]int64

  b = a // 에러 발생
}
```

Go에서 배열의 복사는 깊은 복사이다. 따라서 배열을 복사하면 원본 배열과 복사한 배열은 서로 독립적인 메모리 공간을 가진다.

# 다차원 배열

다차원 배열은 다음과 같이 정의한다.

```go
package main

import "fmt"

func main() {
  var a = [2][2]int{{1, 2}, {3, 4}}

  fmt.Println(a) // [[1 2] [3 4]]
}
```

# 배열 크기

Go의 배엻의 크기는 타입의 크기 \* 배열의 길이이다. 따라서 배열의 크기는 컴파일 시점에 결정된다.
