---
title: '[env] 리눅스에서 trueline으로 예쁜 터미널 만들기'
categories:
  - linux
tags:
  - env
mathjax: true
toc: true
published: true
---
리눅스에서 기본으로 적용되어있는 터미널의 프롬프트는 간결하지만, 조금 칙칙한 느낌이 없지 않다. 또한 조금 더 많은 정보를 알 수 있다면 좋겠다는 생각도 든다. 이제 `trueline`으로 못생긴 리눅스 터미널 프롬프트를 예쁘게 만들어보자. `trueline`은 bash 쉘에도 간단하게 적용 가능하다.

## nerd font 설치하기

`trueline`에서 사용하는 다양한 심볼들은 일반적인 폰트에는 존재하지 않는다. 따라서 ~~이름이 조금 이상하지만~~ `nerd font`라는 특수한 폰트를 적용해야 한다. `nerd font`는 특정한 폰트의 이름은 아니고, `nerd font` 팀에서 `trueline`과 같이 특수한 프롬프트에서 쓰이는 심볼들을 추가해서 제작한 폰트들을 말한다. [공식 홈페이지](https://www.nerdfonts.com/font-downloads)에서 패치된 폰트들을 다운로드받을 수 있다.

당연한 이야기지만, 다운받은 폰트는 반드시 **터미널 클라이언트가 실행되는 머신**에 설치해야 한다. 예를 들어 내가 리눅스 데스크탑을 직접 사용중이라면 데스크탑에 설치하면 되고, 윈도우 혹은 맥의 SSH를 통해 원격 리눅스 머신에 접속한 경우는, SSH 클라이언트 쪽에 폰트를 설치하고 적용해야 한다.

터미널의 폰트를 설치한 폰트로 변경하면 이제 `trueline`을 설치할 준비가 끝났다.

## trueline 설치하기

일단 `trueline`의 [공식 github 저장소](https://github.com/petobens/trueline)를 `git clone`한다.

```bash
git clone https://github.com/petobens/trueline.git ~/trueline
```

그 다음, `trueline/trueline.sh`를 source 하기 위해`.bashrc` 파일에 다음 라인을 추가한다.

```bash
source ~/trueline/trueline.sh
```

이제 trueline 설치는 끝났으며, 다음과 같은 화면을 볼 수 있다.

![trueline](https://user-images.githubusercontent.com/61532201/115880665-f13f5f80-a485-11eb-8c8e-53e5b42d3c86.png){: width="100%" .align-center}

기본적으로 계정 이름, (있다면) 파이썬 가상환경, (해당하는 경우) 현재 git status를 보여준다. (매번 `git status` 안쳐도 된다...!)

## trueline 사용하기

기본 설정도 충분히 보기 좋지만, 취향껏 커스터마이즈하고 싶을 수도 있다. `.bashrc` 파일에 관련 설정을 추가하면 어떤 정보를 포함할지, 각 정보의 순서, 배경 색, 아이콘 등을 변경할 수 있다.

### segment 정의

각 정보가 표시되는 부분을 segment라고 하는데, `.bashrc`에서 다음과 같은 코드를 작성하여 수정할 수 있다.

```bash
declare -a TRUELINE_SEGMENTS=(
    'venv,white,black,normal'
    'conda_env,green,black,normal'
    'user,light_blue,black,normal'
    'working_dir,light_blue,black,normal'
    'git,grey,black,normal'
)
```

괄호 안의 각 줄이 segment이고, 여기에 적힌 순서대로 프롬프트에 나타난다. 각 줄의 구성은 다음과 같다.

```bash
'{segment 이름},{글자색},{배경색},{폰트 weight}'
```

가능한 segment의 이름은 깃허브 저장소를 참고하자. 위 내용을 적용하면 다음과 같이 된다.
![image](https://user-images.githubusercontent.com/61532201/115884025-69f3eb00-a489-11eb-9b38-09e873d90a35.png)

### 입력 프롬프트 줄바꿈

현재 경로가 길어지면, 프롬프트도 너무 길어져서 보기에 좋지 않을 수 있다.
이 때 위의 segment 선언 블록의 마지막에 `'newline,green,black,bold'`를 추가하면 키보드 입력을 받기 전에 줄바꿈이 된다.

![image](https://user-images.githubusercontent.com/61532201/115884362-cb1bbe80-a489-11eb-9b79-cb019d0d1f39.png)

### segment 심볼 변경

segment들의 기본 심볼 또한 변경 가능하다. 예를 들어 줄바꿈 이후에 나오는 segment는 `$` 기호를 사용하는데, 다음과 같이 작성하여 바꿀 수 있다.

```bash
declare -A TRUELINE_SYMBOLS=(
    [newline]='>>>'
)
```

![image](https://user-images.githubusercontent.com/61532201/115885198-ad9b2480-a48a-11eb-83ac-d9514e175e5a.png)

### 추가 기능

이외에도 많은 옵션들이 있는데, [공식 github 저장소](https://github.com/petobens/trueline)에 자세한 내용이 있으므로 참고하면 된다.