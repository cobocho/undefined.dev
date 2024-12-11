---
title: 'Go의 동시성 프로그래밍'
date: '2024/10/28 20:00:00'
---

# 스레드란

고루틴은 경량 스레드로서, 함수나 명령을 동시에 실행할때 사용한다.

프로세스는 한 개 이상의 스레드를 가지며, 스레드는 프로세스의 자원을 공유한다. 스레드는 일졸의 실행 흐름이다. 단일 코어 CPU에서도 스레드를 전환해가며 수행하면서 멀티스레드처럼 보이게 된다.
하지만 스레드를 전환 하는 컨텍스트 스위칭(Context Switching)은 비용이 많이 든다. 하지만 Go에서는 CPU 코어마다 OS 스레드를 하나만 할당하기에 컨텍스트 스위칭 비용이 발생하지 않는다.

# 고루틴

모든 프로그램은 고루틴을 가지고 있다. `main` 함수는 고루틴이다. 고루틴은 `go` 키워드를 사용하여 실행한다. 호출된 함수는 새로운 고루틴에서 실행된다. 여러 고루틴을 사용하는 코드는 다음과 같다.

```go
package main

package main

import (
	"fmt"
	"time"
)

func PrintHangul() {
  haguls := []rune{'가', '나', '다', '라', '마', '바', '사'}

  for _, h := range haguls {
    time.Sleep(300 * time.Millisecond)
    fmt.Printf("%c ", h)
  }
}

func PrintNumbers() {
  for i := 0; i <= 5; i++ {
    time.Sleep(400 * time.Millisecond)
    fmt.Printf("%d ", i)
  }
}

func main() {
  go PrintHangul()
  go PrintNumbers()

  time.Sleep(3 * time.Second)
}

// 출력 결과
// 가 0 나 1 다 2 라 마 3 바 4 사 5
```

만약 서브 고루틴이 종료되지 않아도 메인 고루틴이 종료되면 프로그램이 종료된다.

## 서브 고루틴 기다리기

`sync` 패키지의 `WaitGroup`을 사용하여 서브 고루틴이 모두 종료될 때까지 기다릴 수 있다.

```go
package main

import (
	"fmt"
	"sync"
)

var wg sync.WaitGroup

func SumAtoB(a, b int) {
  sum := 0
  for i := a; i <= b; i++ {
    sum += i
  }
  fmt.Printf("%d부터 %d까지 합계는 %d입니다.\n", a, b, sum)
  wg.Done() // 작업이 끝나면 작업 개수를 1 감소시킴
}


func main() {
  wg.Add(10) // 작업 개수 설정

  for i := 0; i < 10; i++ {
    go SumAtoB(1, 1000000000)
  }

  wg.Wait() // 모든 작업이 끝날 때까지 대기
}
```

# 뮤텍스

뮤텍스는 공유 자원에 대한 접근을 제어하는 기법이다. 뮤텍스는 `sync` 패키지의 `Mutex`를 사용한다.

```go
package main

```
