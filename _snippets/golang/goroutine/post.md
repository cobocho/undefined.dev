---
title: 'Go의 구조체'
date: '2024/10/21 20:00:00'
---

# Go의 구조체

구조체는 서로 다른 타입의 필드를 가지는 데이터 구조를 정의할 때 사용한다. 타 언어의 객체(Object)와 유사한 개념이다.
Go 언어에서 구조체는 다음과 같이 정의한다.

```go
package main

import "fmt"

// 구조체 정의
type Person struct {
  Name string // 필드
  Age  int
}

func main() {
  // 구조체 인스턴스 생성
  p := Person{"Alice", 25}

  // 필드 접근
  fmt.Println(p.Name, p.Age) // Alice 25
}
```

구조체 필드의 값은 변경할 수 있다.

```go
package main

import "fmt"

type Person struct {
  Name string
  Age  int
}

func main() {
  p := Person{"Alice", 25}

  // 필드 값 변경
  p.Name = "Bob"
  p.Age = 30

  fmt.Println(p.Name, p.Age) // Bob 30
}
```

초기화하지 않은 필드는 타입별 기본값으로 초기화된다.

```go
package main

import "fmt"

type Person struct {
  Name string
  Age  int
}

func main() {
  var p Person

  fmt.Println(p.Name, p.Age) // 0
}
```

혹은 일부 필드만 초기화할 수 있다.

```go
package main

import "fmt"

type Person struct {
  Name string
  Age  int
}

func main() {
  p := Person{Name: "Alice"}

  fmt.Println(p.Name, p.Age) // Alice 0
}
```

# 중첩 구조체

구조체 안에 구조체를 중첩하여 사용할 수 있다.

```go
package main

import "fmt"

type Address struct {
  City  string
  State string
}

type Person struct {
  Name    string
  Age     int
  Address Address
}

func main() {
  p := Person{
    Name: "Alice",
    Age:  25,
    Address: Address{
      City:  "Seoul",
      State: "Gangnam",
    },
  }

  fmt.Println(p.Name, p.Age, p.Address.City, p.Address.State) // Alice 25 Seoul Gangnam
}
```

중첩된 구조체의 필드를 접근할 때 필드가 구조체인 경우 `.`을 생략하여 접근할 수 있다.

```go
package main

import "fmt"

type Address struct {
  City  string
  State string
}

type Person struct {
  Name    string
  Age     int
  Address // Address 필드를 중첩
}

func main() {
  p := Person{
    Name: "Alice",
    Age:  25,
    Address: Address{
      City:  "Seoul",
      State: "Gangnam",
    },
  }

  fmt.Println(p.Name, p.Age, p.City, p.State) // Alice 25 Seoul Gangnam
}
```

## 필드의 중복 해결하기

구조체 필드명이 중복되는 경우, 변수 타입에 해당되는 필드에 접근한다.

```go
package main

import "fmt"

type Address struct {
  City  string
  State string
  Name  string
}

type Person struct {
  Name    string
  Age     int
  Address // Address 필드를 중첩
}

func main() {
  p := Person{
    Name: "Alice",
    Age:  25,
    Address: Address{
      City:  "Seoul",
      State: "Gangnam",
      Name:  "Samsung",
    },
  }

  fmt.Println(p.Name, p.Age, p.City, p.State, p.Address.Name) // Alice 25 Seoul Gangnam Samsung
}
```

# 구조체 복사

구조체를 대입하여 복사하면 깊은 복사가 이루어진다.

```go
package main

import "fmt"

type Address struct {
  City    string
  Country string
}

type Person struct {
  Name string
  Age  int
  Address
}

func main() {
  p1 := Person{"Alice", 25 , Address{"서울", "한국"}}
  p2 := p1 // 구조체 복사

  fmt.Println(p1) // {Alice 25}
  fmt.Println(p2) // {Alice 25}

  p2.Address.City = "LA" // p2의 Address 필드 변경
  p2.Name = "Bob" // p2의 Name 필드 변경

  fmt.Println(p1) // {Alice 25}
  fmt.Println(p2) // {Bob 25}
}
```

# 필드 배치에 따른 구조체 크기

```go
package main

import (
	"fmt"
	"unsafe"
)

type User struct {
  Age int32 // 4 bytes
  Score float64 // 8 bytes
}

func main() {
  user := User{ 23, 77.2}

  fmt.Println(unsafe.Sizeof(user)) // 16
}
```

앞서 설명한 구조체의 크기는 4 + 8 = 12 bytes가 되어야 하지만, 실제로는 16 bytes가 된다.
이는 구조체의 필드 배치에 따라 메모리 정렬이 이루어지기 때문이다. Go 언어에서는 구조체의 필드를 메모리 정렬을 위해 패딩을 추가하여 정렬한다.

메모리 정렬이란 컴퓨터가 데이터에 효과적으로 접근하기 위해 데이터를 메모리에 저장할 때 일정한 규칙에 따라 배치하는 것을 말한다. 예를 들어, 64비트 컴퓨터에서 int64 데이터의 시작 주소가 100번지일 경우 100은 8의 배수가 아니기 때문에 읽을 때 손해를 볼 수 있다. 따라서 100번지에 int64 데이터를 저장할 때 8의 배수인 104번지에 저장하는 것이 효율적이다.

`Age`는 4바이트이고 `Score`는 8바이트이다. `user`의 시작 주소가 만약 240번지이면 `Age`의 시작 주소 또한 240번지이다. 이때 `Score`를 바로 붙여서 할당하면 244번지에 할당되는데, 이는 8의 배수가 아니다. 따라서 4 Byte의 패딩을 추가하여 248번지에 할당된다. 이러한 필드 사이 공백을 **메모리 패딩**이라고 한다.

## 메모리 패딩을 고려한 필드 배치

```go
package main

import (
	"fmt"
	"unsafe"
)

type User struct {
  A int8 // 1 byte
  B int // 8 byte
  C int8 // 1 byte
  D int // 8 byte
  E int8  // 1 byte
}

func main() {
  user := User{ 1, 2, 3, 4, 5 }

  fmt.Println(unsafe.Sizeof(user))
}
```

위 코드에서 `User` 구조체는 1바이트 필드 3개와 8바이트 필드 2개로 구성되어 있다. 따라서 총 19바이트가 되어야 하지만, 메모리 패딩을 고려하면 40바이트가 된다. 이는 1 Byte 필드에 모두 7 Byte 패딩이 추가되었기 때문이다.
이때, **8 바이트 미만의 크기인 필드는 8 바이트를 고려해 몰아서 배치**하면서 패딩을 줄일 수 있다.

```go
package main

import (
	"fmt"
	"unsafe"
)

type User struct {
  A int8 // 1 byte
  B int // 8 byte
  C int8 // 1 byte
  D int // 8 byte
  E int8  // 1 byte
}

func main() {
  user := User{ 1, 2, 3, 4, 5 }

  fmt.Println(unsafe.Sizeof(user))
}
```

위와 같이 작성하면 `A, B, C`가 하나로 묶이고 메모리 패딩이 적용되면서 24바이트가 된다.
