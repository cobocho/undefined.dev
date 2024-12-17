---
title: 'Go의 기본 개념'
date: '2024/10/18 20:00:00'
---

# Go의 특징

Go 언어의 특징으로는 다음과 같은 것들이 있다.

- 클래스와 상속이 없다.
- 인터페이스를 통해 다형성을 지원한다.
- 가비지 컬렉션을 지원한다.
- 포인터가 존재한다.
- 1.18 버전부터 제네릭을 지원한다.
- 네임스페이스가 없으며 패키지를 통해 모듈화를 한다.

# 실행 방법

Go 언어에서 모든 코드는 패키지로 구성된다. 동일한 폴더의 코드는 같은 패키지로 묶이며, 패키지 이름은 폴더 이름과 동일하다.

예를 들어 `goproject/hello/extra`의 경우 `hello`내의 `.go` 파일은 `hello` 패키지, `extra`내의 `.go` 파일은 `extra` 패키지로 묶인다.

이렇게 작성된 코드는 빌드 전 모듈을 생성하는데 이때, `go mod init` 명령어를 사용한다.

```bash
go mod init goproject/hello
```

이렇게 하면 `go.mod` 파일이 생성되며, 이 파일은 프로젝트의 의존성을 관리하는 파일이다.
`go build` 명령어를 통해 코드를 빌드하고 실행할 수 있다. 이때, `GOOS`와 `GOARCH` 환경 변수를 통해 빌드할 운영체제와 아키텍처를 지정할 수 있다. 또는 `go run` 명령어를 사용하여 코드를 빌드하고 실행할 수 있다.

# 코드로 알아보기

```go
// goproject/hello/main.go

// 패키지 선언 (모든 코드는 패키지로 묶인다)
package main

// fmt 패키지를 임포트한다
import "fmt"

// main 함수를 선언한다 (모든 프로그램은 main 함수에서 시작된다. 즉 main은 프로그램의 시작점이다)
func main() {
  // fmt 패키지의 Println 함수를 사용하여 "Hello, World!"를 출력한다
	fmt.Println("Hello, World!")
}
```