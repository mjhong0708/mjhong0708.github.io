---
layout: post
title: "[Tips] Python 다양한 팁 모음"
date: 2022-10-30 22:07 +0900
categories: [Tips]
# math: true
---

Python 팁 및 노하우


## General

- 간단한 반복문은 list comprehension이나 dictionary comprehension을 활용하면 좋다.
- `list`와 `tuple`은 매우 비슷하나 용도가 약간 다르다. 
  - `list`는 `dict`의 key로 사용할 수 없으나, `tuple`은 가능하다.
  - 기존 값을 새 변수에 할당할 때 `list`는 값의 복사가 없지만(shallow copy됨) `tuple`은 전체 값이 모두 복사된다.
  - `tuple`을 사용하면 좋은 경우는 1) 그 값이 변하지 않을 때 또는 2) 함수의 default argument로 사용되는 경우이다.
  - Default argument로 mutable한 타입인 list를 사용하면 [안 좋은 일이 일어난다](https://frhyme.github.io/python-basic/default_parameter_value_in_python/).
- 반복문 로직 작성 시 [`itertools`](https://docs.python.org/ko/3/library/itertools.html)를 적극적으로 활용하면 삶의 질이 올라간다.
- 반복문에서 값과 인덱스가 동시에 필요하면 `for i in range(len(vals))`보다는 `for i, val in enumerate(vals)`가 좋다.


## Function

- 함수가 복잡해지면 일부분을 다른 함수 또는 클래스로 factoring하자. 함수가 복잡해진다는 것은 1) 함수가 처리하는 로직이 너무 많아지거나 2) 같은 코드가 여러 번 반복되는 경우를 말한다.
- 어떤 함수가 자주 사용되는데 특정 argument를 고정하고 싶은 경우 `functools.partial` 데코레이터를 사용하자.
- 데코레이터를 정의할 때 데코레이팅 되는 함수의 정보를 보존하려면 `functools.wraps`를 사용하면 좋다.
- 람다 함수는 꼭 필요한 경우가 아니면 변수로 할당하지 않는 것이 좋다.


## Code style

- 변수의 이름은 descriptive한 것이 좋다.
- 가독성이나 일관성을 위해 코드 작성 시 [PEP8 스타일 가이드](https://peps.python.org/pep-0008/)를 따르는 것이 좋다. 직접 맞추기 번거로운 경우 `autopep8`, `yapf`, `black` 등의 formatter와 `flake8`, `pylint` 등의 linter를 사용하면 편하다.
- Formatter는 코드 스타일을 자동으로 조정해주는 도구이며, 띄어쓰기와 들여쓰기, 줄바꿈 등을 변경해준다. `black`은 Python 재단에서 개발한 도구로, 타협의 여지 없이 일관적인 스타일을 적용한다. `yapf`는 구글에서 개발했으며 코드의 미관을 중시한다. 각자 취향에 맞춰 선택하여 사용하면 된다.
- Linter는 코드 실행 전에 코드 상에 존재할 수 있는 오류나 좋지 않은 코드를 탐색하여 알려준다. `pylint`가 `flake8`에 비해 훨씬 strict하며, `flake8`은 조금 더 loose하고 가볍다.
  - Linter는 VS Code와 같은 IDE와 궁합이 매우 좋다.
- 코드 작성 시 (특히 함수 및 클래스) 주석을 작성하는 것이 좋다. 혼자서 사용하는 코드이더라도 작성하는 것이 좋다 (나중에 보면 뭐하는 코드인지 까먹기 때문...). 함수는 docstring 포맷을 정하여 작성하자.
  - ex) Google style:
```python
    def full_name(first_name, last_name):
        """ Generate full name from first and last name.

        Args:
            first_name (str): First name.
            last_name (str): Last name.

        Returns:
            str: The full name of given person.
        """
        return f"{first_name} {last_name}"
```
  - Docstring을 작성해놓으면 나중에 [Sphinx](https://www.sphinx-doc.org/en/master/)라는 도구를 사용하여 자동으로 API 문서를 웹 형식으로 만들 수 있어 매우 편리하다.
- 번거롭더라도, [type annotation](https://docs.python.org/3/library/typing.html)을 하자. 코드의 가독성을 크게 올려준다. 내장 라이브러리인 `typing` 패키지를 사용하면 다양한 type annotation이 가능하다.
```python
def full_name(first_name: str, last_name: str) -> str:
    """ Generate full name from first and last name.

    Args:
        first_name (str): First name.
        last_name (str): Last name.

    Returns:
        str: The full name of given person.
    """
    return f"{first_name} {last_name}"
```

<!-- ## Numpy -->
