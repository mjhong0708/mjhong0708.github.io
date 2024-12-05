---
layout: post
title: "SLURM 자주 사용하는 유용한 기능들"
date: 2024-12-05 13:33 +0900
categories: [Tips]
# math: true
---

## Generic resource (gres)를 이용하여 GPU job 올리기

SLURM의 gres 기능을 사용하여 GPU 작업을 스케줄링 하는 방법은 다음과 같다. (slurm.conf 및 gres.conf에 미리 설정해야 함)

```bash
srun --gres [type]:[n] [command]
```

여기서 `type`은 미리 설정된 리소스의 종류이고, `n`은 사용할 device의 개수로 0일 경우 가용한 모든 리소스를 사용한다.
예시:
```bash
srun -p gpu-a6000 --gres gpu:1 --cpus-per-task=8 -N 1 python train.py
```

## Job array 사용법

Job array는 비슷한 작업을 여러 개 실행해야 할 경우 유용한 기능이다. `--array=i-j%n`과 같은 형태로 각 job의 인덱스를 할당할 수 있고(`i`: 시작값, `j`: 끝값, `n`: 동시작업의 최대 개수), 각 인덱스는 환경변수 `SLURM_ARRAY_TASK_ID`에 할당되어 특정 명령의 파라미터로 활용할 수 있다.
예시 job script는 다음과 같다.
```bash
#!/bin/bash
#SBATCH -J my_job_array
#SBATCH --array=0-99%50
#SBATCH -p g1,g2
#SBATCH -N 1
#SBATCH --ntasks-per-node 16
#SBATCH -e subtask_%a/stderr.log
#SBATCH -o subtask_%a/stdout.log

TASK_DIR="$SLURM_SUBMIT_DIR/subtask_$SLURM_ARRAY_TASK_ID"
# 이후 자유롭게 command 작성
```
위와 같이 작성할 경우 `g1`, `g2` 노드에 0번부터 99번의 job이 subtask로 올라가게 되고, 동시에 최대 50개의 job만 실행된다. (나머지는 `PENDING`)
이 방법의 장점은 squeue 등 작업 스케줄을 확인할 때 단일 레코드만 생성된다는 점이다. 예를 들어 job array 자체의 ID가 `12345`라 하면, ID `12345`의 레코드 하나만 생성된다.
만약 job state가 `RUNNING`으로 바뀔 경우 task ID에 따라 `12345_1`, `12345_2`, ... 등으로 실행중인 job에 대한 정보만 따로 레코드가 생성된다.


## Python의 output buffering 문제

Python 런타임은 기본적으로 표준 출력에 buffering을 적용하며, 이를 자주 flush하지 않기 때문에 SLURM job에서 python 스크립트를 실행할 시 stdout이 자주 갱신되지 않는다.
해결법은 python의 stdout buffering을 매 line마다 적용하게 하는 것이다.
다음 명령을 스크립트에 추가하면 된다.
```python
import sys

sys.stdout.reconfigure(line_buffering=True, write_through=True)
```

## 병렬 작업을 제출할 때 유의할 사항: OPENMP vs MPI

많은 HPC 클러스터용 프로그램이 병렬 연산을 위해 OPENMP 또는 MPI를 사용한다. 그런데 OPENMP는 한 프로그램 내에서 여러 개의 스레드를 사용하고, MPI는 여러 프로세스(SLURM 용어로 `task`)를 실행하고 이들 간의 통신을 통해 작업 결과를 모으는 프로토콜이다.
따라서 SLURM 사용 시 관련 옵션을 적절히 주어야 의도한 대로 병렬연산을 활용할 수 있다.

- `--ntasks-per-node` 옵션은 각 노드에서 동시에 실행할 수 있는 task의 개수를 의미한다. 이는 OPENMPI를 사용하는 프로그램에서 사용된다.
- `--cpus-per-task` 옵션은 어떤 프로세스가 사용할 수 있는 cpu의 개수를 의미한다. 이는 OPENMP 사용시 필요하다.

계산화학 분야에서 대표적인 프로그램들의 분산처리 방법은 다음과 같다.

- VASP: MPI
- ORCA: MPI
- LAMMPS: MPI, OPENMP
- xTB: OPENMP
