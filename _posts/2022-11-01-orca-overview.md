---
layout: post
title: ORCA를 이용한 계산화학 분자 모델링 overview
categories:
- Computational chemistry
- ORCA
date: 2022-11-01 12:18 +0900
---
ORCA는 다양한 분자 전산모사 기법을 제공하는 계산화학 소프트웨어로, academic license에 한하여 무료이다. 
- Hartree-Fock
- Kohn-Sham DFT
- Moller-Plesset perturbation theory
- Coupled Cluster method

## 설치하기

[ORCA forum의 다운로드 페이지]([ORCA Forum - Downloads (mpg.de)](https://orcaforum.kofo.mpg.de/app.php/dlext/))에서 다운받을 수 있다 (회원가입 필요). 운영체제에 맞는 버전을 받아 임의의 경로에 다운받고 압축을 풀면 된다. 다운받고 난 뒤에는 압축을 푼 폴더를 `PATH`와 `LD_LIBRARY_PATH`에 추가하면 ORCA의 설치가 완료된다.

주의해야 할 점은, 다운로드 받은 파일에 표시되어 있는 OpenMPI 버전을 사용해야 한다는 점이다. 작성 시점 기준으로 ORCA 5.0.3d은 openmpi 4.1.1을 사용하며, 설치되어있지 않은 경우 직접 설치해야 한다. 이 때 시스템에 설치하기보다는 별도의 공간에 설치하는 것이 좋다.

## 기본 사용법

### 입력 파일

```
# 주석은 '#'으로 시작
# !로 시작하는 줄: simple input
!B3LYP def2-SVP D3 Opt FREQ

# 기타 block input들
%pal
nprocs 8
end

%geom
maxiter 500
end

# 입력 구조
*xyz 0 1
O      0.007544    0.397743    0.000000
H     -0.767103   -0.184393    0.000000
H      0.759559   -0.213350    0.000000
*
```
{: file="orca.inp" }

- 첫 줄에는 `!`로 시작하여 계산에 필요한 파라미터를 간단한 형식으로 표시한다.
	- `B3LYP`은 XC functional을 지정한다. 당연히 method는 자동으로 DFT가 된다.
	- `def2-SVP`는 basis set이다. 사용가능한 basis set은 매뉴얼 참조
	- `D3`은 D3 dispersion correction을 사용할 것임을 의미한다.
	- `Opt`는 geometry optimization을 수행할 것임을 의미한다. 이를 지정하지 않으면 single point 계산만을 수행한다.
	- `Freq`는 계산이 끝난 후 frequency 분석을 수행할 것임을 의미한다.
- 더 복잡한 파라미터는 위와 같이 block으로 지정할 수 있다.
	- `%pal` 블록은 병렬 연산 옵션을 지정한다. `nprocs` 옵션으로 사용할 프로세스의 수를 지정할 수 있다.
	- `%geom` 블록은 geometry optimization과 관련된 옵션을 지정한다. `maxiter`는 최대 iteration 수를 의미한다.
- 입력 구조는 xyz format으로 작성할 수 있다.
	- `*xyz` 뒤의 숫자는 각각 net charge, spin multiplicity이다.
	- 그 뒤에 원자의 종류와 좌표를 입력한다. 단위는 Angstrom이다.

- 또는, `*xyzfile 0 1 input.xyz`와 같이 아예 xyz 파일을 입력 구조로 지정할 수 있다.

### 실행하기

병렬 연산을 위해서는 항상 실행파일의 전체 경로를 사용해야 한다. 여기서는 `ORCADIR`이라고 하겠다.
다음과 같이 실행할 수 있다.

```bash
$ORCADIR/orca orca.inp > orca.out
```


## 출력 파일

ORCA 계산 결과에는 많은 출력 파일이 있지만, 그 중 자주 확인하는 파일들은 다음과 같다.

- `*.out`: 위에서 실행 시 `stdout`을 저장한 파일로, 계산의 진행과 결과가 모두 여기에 입력된다.
- `*.gbw`: wavefunction 관련 정보가 들어있는 바이너리 파일이다. 이후에 다양한 프로그램으로 분석할 수 있다.
- `*_trj.xyz`: Opt일 때만 생기며, optmization trajectory이다.
- `*_property.txt`: 계산 결과 (에너지, population 등)을 요약하여 보여준다.

`orca.out` 파일에는 예를 들어 다음과 같은 정보가 표시된다.
```
...
Maximum memory used throughout the entire SCF-calculation: 43.4 MB


-------------------------------------------------------------------------------
                          DFT DISPERSION CORRECTION

                              DFTD3 V3.1  Rev 1
                          USING Becke-Johnson damping
-------------------------------------------------------------------------------
The B3LYP functional is recognized
Active option DFTDOPT                   ...         4

molecular C6(AA) [au] = 44.536614


            DFT-D V3
 parameters
 s6 scaling factor         :     1.0000
 a1 scaling factor         :     0.3981
 s8 scaling factor         :     1.9889
 a2 scaling factor         :     4.4211
 ad hoc parameters k1-k3   :    16.0000     1.3333    -4.0000

 Edisp/kcal,au: -0.360159001995  -0.000573949842
 E6   /kcal   :  -0.196960922
 E8   /kcal   :  -0.163198080
 % E8         :  45.312786673

-------------------------   ----------------
Dispersion correction           -0.000573950
-------------------------   ----------------


-------------------------   --------------------
FINAL SINGLE POINT ENERGY       -76.321843955807
-------------------------   --------------------
```
{: file="orca.out" }

## 일반적인 계산 과정

ORCA를 통해 어떤 분자 모델링 및 계산을 하더라도 거의 항상 구조 최적화 후에 single point 계산을 하게 된다. 일반적으로는 덜 정확한 대신 빠른 방법(low-level theory)으로 구조 최적화를 수행한 후 더 정확한 방법(higher level theory)으로 single point 계산을 하게 된다.

처음에 덜 정확한 방법을 사용하는 이유는 구조 최적화에 여러 번의 single point 계산이 필요하기 때문이다. 적게는 수 번에서 수십 번의 계산이 필요하다. 따라서 정확도를 다소 희생하더라도 더 빠른 방법을 사용하는 것이 좋다. 또한 에너지에 비해 구조는 계산 방법에 따른 차이가 그렇게 크지 않으므로, 무리하게 정확도를 높일 필요는 없다.

ORCA에서 제공하는 계산 방법 중 많이 쓰이는 것들을 low level부터 high level로 나열하면 다음과 같다.

- xTB (semiempirical)
- DFT
  - 추가적으로 basis set에 따라 효율 및 정확도 달라짐
  - def2-SVP
  - def2-TZVP
  - def2-TZVPP
  - def2-TZVPPD
  - def2-QZVP
  - ...
- MP2
- CCSD(T)

이를 이용해 workflow를 하나 예시로 들어보자.

1. (Optional) 안정적인 구조를 아주 대략적으로만 아는 경우 xTB를 통해 preliminary 구조 최적화 수행
2. Low-level DFT method로 구조 최적화 (ex. def2-SVP)
3. 최적화된 구조가 적절한 local minimum인지 확인 (vibration analysis)
4. High-level DFT method로 single point energy 계산 (ex. def2-TZVPP)
5. (Optional) 더 정확한 electronic energy가 필요한 경우 CCSD(T)를 이용하여 에너지 계산

각 step에 대한 입력 파일은 다음과 같다.

```
!XTB Opt

%pal
nprocs 8
end

*xyz 0 1
O      0.007544    0.397743    0.000000
H     -0.767103   -0.184393    0.000000
H      0.759559   -0.213350    0.000000
*

```
{: file="orca-opt-xtb.inp" }

```
!B3LYP def2-SVP Opt FREQ

%pal
nprocs 8
end

*xyz 0 1
O       0.007194      0.379280      0.000000
H      -0.775644     -0.174996      0.000000
H       0.768450     -0.204284      0.000000
*

```
{: file="orca-opt-def2-svp.inp" }

```
!B3LYP def2-TZVPP Freq

%pal
nprocs 8
end

*xyz 0 1
O       0.007611      0.400859      0.000000
H      -0.760818     -0.186074      0.000000
H       0.753207     -0.214786      0.000000
*

```
{: file="orca-singlepoint-def2-tzvpp.inp" }

```
!DLPNO-CCSD(T) cc-pVTZ cc-pVTZ/C

%pal
nprocs 8
end

*xyz 0 1
O       0.007611      0.400859      0.000000
H      -0.760818     -0.186074      0.000000
H       0.753207     -0.214786      0.000000
*

```
{: file="orca-singlepoint-ccsdt.inp" }
