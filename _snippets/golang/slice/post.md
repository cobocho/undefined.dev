---
title: 'Go의 슬라이스'
date: '2024/10/23 20:00:00'
---

# Go의 슬라이스

Go에서 배열의 경우 크기가 고정되어 있어 유연한 사용이 어렵다. 이를 해결하기 위해 슬라이스(slice)를 사용한다. 슬라이스는 배열의 일부를 가리키는 참조 타입이다.
슬라이스는 배열의 길이를 선언하지 않고 사용할 수 있으며, 동적으로 크기를 조절할 수 있다.

```go
var array [5]int = [5]int // 배열 선언
var slice []int // 슬라이스 선언
```

만약 슬라이스를 초기화하지 않으면 길이가 0인 슬라이스가 생성된다.
초기화를 할 때는 배열처럼 `{}`를 사용하거나 `make` 함수를 사용한다.

```go
var slice1 []int // 길이가 0인 슬라이스
var slice2 = []int{1, 2, 3}
var slice3 = make([]int, 5) // 길이가 5인 슬라이스
var slice4 = make([]int, 3, 5) // 길이가 3이고 용량이 5인 슬라이스
```

슬라이스에 접근할 때에는 배열과 동일하게 `[]`를 사용한다.

```go
package main

import "fmt"

func main() {
  var slice = []int{1, 2, 3, 4, 5}

  fmt.Println(slice[0]) // 1
  fmt.Println(slice[1]) // 2
}
```

# 요소 추가

슬라이스에 요소를 추가할 때에는 `append` 함수를 사용한다. `append` 함수를 사용하면 기존 슬라이스의 맨 뒤에 요소를 추가해 만든 새로운 슬라이스를 반환한다.

```go
package main

import "fmt"

func main() {
  var slice = []int{1, 2, 3}

  slice = append(slice, 4)

  fmt.Println(slice) // [1 2 3 4]

  slice = append(slice, 5, 6, 7)

  fmt.Println(slice) // [1 2 3 4 5 6 7]
}
```

# 동작 원리

슬라이스는 `SliceHeader` 구조체로 구성되어 있다. 이 구조체는 슬라이스의 요소 개수*Length*, 길이*Cap*, 포인터*Data*를 가지고 있다. 슬라이스가 실제 배열을 가리키는 포인터를 소유함으로서 크기가 가변적인 배열을 구현할 수 있다.

그렇기에 다음 코드와 같이 배열과는 다른 동작을 보인다.

```go
package main

import "fmt"

func changeArray(array [5]int) {
  array[0] = 10
}

func changeSlice(slice []int) {
  slice[0] = 10
}

func main() {
  var array = [5]int{1, 2, 3, 4, 5}
  var slice = []int{1, 2, 3, 4, 5}

  changeArray(array)
  changeSlice(slice)

  fmt.Println(array) // [1 2 3 4 5]
  fmt.Println(slice) // [10 2 3 4 5]
}
```

이는 함수의 인자로 넘어가면서 복사되는 값이 다르기에 발생하는 현상이다. 배열은 값이 복사되어 함수로 이동한다. 즉 복사되는 값의 크기는 배열의 크기와 같다. 하지만 슬라이스는 포인터를 포함한 구조체를 복사하므로 슬라이스의 크기와 상관없이 항상 고정된 크기의 메모리*24 Byte*를 사용한다.

## Append 함수에서 발생할 수 있는 문제

`append()` 함수가 호출되면 우선 빈공간이 있는지 확인한다. 이는 `cap - len`과 동일하다. 만약 빈 공간이 추가할 값의 개수보다 크거나 같다면 배열 뒷부분에 값을 추가 후 `len`을 증가시킨다. 하지만 빈 공간이 부족하다면 새로운 배열을 생성한다. 일반적으로 새로운 배열의 크기는 기존 배열의 2배이다. 그리고 기존 배열의 값을 새로운 배열로 복사한 후 새로운 배열에 값을 추가한다. `cap`은 새로운 배열의 크기가 되고 `len`은 추가된 값의 개수가 된다. 이후 포인터는 새로운 배열을 가리키게 된다.

```go
package main

import "fmt"

func main() {
	slice := make([]int, 3, 5) // 길이가 3이고 용량이 5인 슬라이스
	firstSlicePointer := &slice[0] // 첫 번째 요소의 포인터

	fmt.Println("slice:", slice, "firstSlicePointer:", firstSlicePointer) // slice: [0 0 0] firstSlicePointer: 0xc0000b6010

	slice = append(slice, 1, 2) // 슬라이스에 1, 2 추가
	firstSlicePointer = &slice[0] // 첫 번째 요소의 포인터

	fmt.Println("slice:", slice, "firstSlicePointer:", firstSlicePointer) // slice: [0 0 0 1 2] firstSlicePointer: 0xc0000b6010 용량이 부족하지 않아 메모리 재할당이 일어나지 않음

	slice = append(slice, 1) // 슬라이스에 1 추가
	firstSlicePointer = &slice[0] // 첫 번째 요소의 포인터

	fmt.Println("slice:", slice, "firstSlicePointer:", firstSlicePointer) // slice: [0 0 0 1 2 1] firstSlicePointer: 0x14000132000 용량이 부족하여 메모리 재할당이 일어남
}
```

따라서 슬라이스를 사용할 때에는 `append()` 함수를 사용할 때 메모리 재할당이 일어날 수 있음을 염두해 두어야 한다. 메모리 재할당이 일어나면 기존 슬라이스의 포인터가 변경되므로 주의해야 한다.

# 슬라이싱

슬라이싱은 슬라이스나 배열에서 슬라이스를 추출하는 것을 말한다. 슬라이싱은 배열과 슬라이스 모두에서 사용할 수 있다.

```go
package main

import "fmt"

func main() {
  var array = [5]int{1, 2, 3, 4, 5}
  var slice = []int{1, 2, 3, 4, 5}

  var slicedArray = array[1:3] // 배열의 1번째부터 3번째 요소까지 슬라이싱
  var slicedSlice = slice[1:3] // 슬라이스의 1번째부터 3번째 요소까지 슬라이싱

  fmt.Println(slicedArray) // [2 3]
  fmt.Println(slicedSlice) // [2 3]
}
```

이를 이용해서 슬라이스를 복사할 수도 있다.

```go
package main

import "fmt"

func main() {
  var slice = []int{1, 2, 3, 4, 5}
  var copiedSlice = make([]int, len(slice))

  for i, v := range slice {
    copiedSlice[i] = v
  }

  slice[0] = 10
  fmt.Println(slice) // [10 2 3 4 5]
  fmt.Println(copiedSlice) // [1 2 3 4 5]
}
```

혹은 `copy` 함수를 사용할 수도 있다.

```go
package main

import "fmt"

func main() {
  var slice = []int{1, 2, 3, 4, 5}
  var copiedSlice = make([]int, len(slice))

  copy(copiedSlice, slice)

  slice[0] = 10
  fmt.Println(slice) // [10 2 3 4 5]
  fmt.Println(copiedSlice) // [1 2 3 4 5]
}
```

## 요소 삭제

슬라이스에서 요소를 삭제할 때에는 ` `append` 함수를 사용하면 삭제할 요소를 제외한 나머지 요소를 새로운 슬라이스로 복사하여 반환한다.

```go
package main

import "fmt"

func main() {
  var slice = []int{1, 2, 3, 4, 5}

  slice = append(slice[:2], slice[3:]...)

  fmt.Println(slice) // [1 2 4 5]
}
```

## 요소 삽입

슬라이스 중간에 요소를 삽입할 때에는 슬라이스의 맨 뒤에 요소를 추가한 후, 해당 요소를 원하는 위치로 이동시키면 된다.

```go
package main

import "fmt"

func main() {
  var slice = []int{1, 2, 3, 4, 5}

  slice = append(slice, 0)

  copy(slice[3:], slice[2:])
  slice[2] = 10

  fmt.Println(slice) // [1 2 10 3 4 5]
}
```
