---
published: false
---
# [ASE] 2. ASE의 중심, Atoms 클래스 (1) - 기본사항

ASE의 핵심 클래스인 `Atoms` 클래스와 `Atom`클래스에 대해 알아보자.

## Prerequisities
다음 내용들을 알고 있으면 이 포스트를 더욱 이해하기 쉽다.
- python 개념들
  - class
  - sequence
- Unit cell
## Atoms 클래스 소개
`ASE`에서 모든 구조 정보는  `Atoms` 객체의 attribute로 저장되며, `Atoms`의 메소드를 통해 원자 간의 거리, 각도 등의 성질을 계산하는 기능을 제공한다. 
### Atoms의 주요 attribute
`Atoms` 객체에는 다양한 attribute가 있는데, 그 중 자주 쓰이는 것들은 다음과 같다.
- `positions` : 각 원자들의 cartesian coordinate로 이루어진 (n x 3) `ndarray`
- `cell` : 

