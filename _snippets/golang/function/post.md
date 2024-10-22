---
title: 'Go의 함수'
date: '2024/10/19 12:00:00'
---

# 함수 정의

함수는 함수 키워드, 함수명, 매개변수, 반환 타입, 함수 본문으로 구성된다. Go 언어에서 함수는 다음과 같이 정의한다.

```go
package main

import "fmt"

func Add(a int, b int) int {
	return a + b
}

func main() {
	c := Add(1, 2)

	fmt.Println(c)
}
```

# 멀티 반환

함수는 값을 여러 개 반환할 수 있다. 이때, 반환할 값의 타입을 괄호로 묶어서 반환한다.

```go
package main

import "fmt"

func Decide(a, b int) (int, bool) {
	if b == 0 {
		return 0, false
	}
	return a / b, true
}

func main() {
	c, success := Decide(9, 3)
	fmt.Println(c, success) // 3 true

	d, success := Decide(9, 0)
	fmt.Println(d, success) // 0 false
}
```
