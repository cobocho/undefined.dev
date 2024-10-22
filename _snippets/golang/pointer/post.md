---
title: 'Go의 포인터'
date: '2024/10/22 20:00:00'
---

# Go의 포인터

포인터는 메모리 주소를 값으로 가지는 변수이다. 메모리 주솟값을 변수로 가질 수 있는 변수를 포인터 변수라고 한다.
Go는 항상 값에 의한 전달을 통해 함수를 호출한다. 포인터를 사용하면 함수 호출 시 값을 복사하는 대신 메모리 주소를 전달할 수 있다.

포인터 변수는 `*` 기호를 사용하여 선언한다. 변수에 `&` 기호를 사용하면 해당 변수의 메모리 주소를 얻을 수 있다.

```go
package main

import "fmt"

func main() {
  var a int = 10
  var p *int

  p = &a

  fmt.Println("p의 값:", p) // p의 값: 0xc0000b6010
  fmt.Println("p가 가리키는 값:", *p) // p가 가리키는 값: 10
  *p = 100
  fmt.Println("a의 값:", a) // a의 값: 100
}
```

# 포인터 변숫값 비교

`==` 연산을 통해 포인터가 같은 메모리 주소를 가리키는지 확인할 수 있다.

```go
package main

import "fmt"

func main() {
  var a int = 10
  var b int = 20
  var p1 *int = &a
  var p2 *int = &b

  fmt.Println(p1 == p2) // false
}
```

포인터 변수의 기보값은 `nil`이다. `nil`은 메모리 주소가 없음을 의미한다.

```go
package main

import "fmt"

func main() {
  var p *int

  fmt.Println(p) // false
}
```

# 포인터의 사용 이유

변수 대입이나 함수 전달은 항상 값 복사를 통해 이루어진다. 이는 많은 메모리 공간을 차지하게 되므로 성능에 영향을 줄 수 있다.

# 인스턴스

인스턴스란 메모리에 할당된 데이터의 실체이다.

```go
var person Person
var p *Person = &person
```

인스턴스를 별도로 생성하지 않고 곧바로 포인터를 생성할 수도 있다.

```go
var p *Person = &Person{}
```

포인터 변수가 여러개더라도 하나의 인스턴스를 가리킨다.

```go
var p1 *Person = &Person{}
var p2 *Person = p1
var p3 *Person = p1
```

하지만 대입을 통해 인스턴스를 복사하면 새로운 인스턴스가 생성된다.

```go
var p1 Person
var p2 Person = p1
var p3 Person = p1
```

위 코드에서는 총 3개의 인스턴스가 생성된다.

# `new` 함수

`new` 함수를 사용하여 포인터 변수를 생성할 수 있다. `new` 함수는 메모리를 할당하고 해당 메모리 주소를 반환한다.

```go
p1 := &Person{}
p2 := new(Person)
```

`new()` 함수는 인수로 타입을 받는더ㅏ. `new()`는 내부 필드를 원하는 값으로 초기화 할 수는 없지만, `&`를 사용하는 방식은 초기화를 할 수 있다.

# 인스턴스의 소멸

Go는 가비지 컬렉션을 지원한다. 가비지 컬렉션은 더 이상 사용되지 않는 메모리를 자동으로 해제한다. 따라서 Go에서는 메모리 누수를 방지할 수 있다.

```go
func Test() {
  p := &Person{}
  // p 사용
  p.age = 10

  // p 사용이 끝나면 메모리 해제
}
```

일반적으로 함수가 끝나게 되면 함수 내부에서 생성된 인스턴스는 메모리에서 해제된다. 하지만 함수 내부에서 생성된 인스턴스가 함수 밖에서 사용되는 경우, 메모리가 해제되지 않는다.

```go
func Test() *Person {
  p := &Person{}

  return p // 탈출 분석으로 인해 p는 메모리에서 해제되지 않음
}
```
