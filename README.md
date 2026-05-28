# 강화는 못 참지 - Git/배포 준비 버전

이 ZIP은 GitHub 업로드용으로 정리된 버전입니다.

## GitHub 업로드

자세한 순서는 `GIT_PUSH_GUIDE.md`를 확인하세요.

핵심 명령어:

```cmd
git init
git add .
git commit -m "Initial deploy ready version"
git branch -M main
git remote add origin https://github.com/본인계정/enhance-web-game.git
git push -u origin main
```

## 실행 기준

개발 서버는 5174번 포트를 사용합니다.

```cmd
pnpm install
pnpm dev --port 5174
```

테스트 서버는 5173번 포트를 사용합니다.

```cmd
pnpm dev --host 0.0.0.0 --port 5173
```

빌드 확인:

```cmd
pnpm build
```

## 정적 배포 기준

```txt
Build Command: pnpm build
Output Directory: dist
```

---

# 강화는 못 참지 - v0.2

React + Vite 기반 로컬 웹게임 프로토타입입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173/` 접속.

## v0.2 수정 내용

- 스프라이트 크롭 방식을 재작성했습니다.
  - 6프레임 가로형 시트를 실제 이미지 크기 기준으로 자동 계산합니다.
  - 옆 프레임이 삐져나오지 않도록 viewport overflow hidden 구조로 수정했습니다.
  - 공격 후 frame 0 대기 상태로 복귀합니다.
- 피격/강화 이펙트는 1회 재생 후 사라지도록 수정했습니다.
- 강화 화면을 제단 중심 UI로 재구성했습니다.
  - 충전 → 실루엣 → 결과 이펙트 → 다음 무기 등장 흐름을 추가했습니다.
- 룰렛 UI를 아이콘 중심 + 확률표 구조로 변경했습니다.
  - 룰렛 내부 한글 가독성 문제를 줄였습니다.
  - 무기별/몬스터별 확률 비율은 실제 conic-gradient에 반영됩니다.
- PVE 전투 연출을 상태 머신 방식으로 재구성했습니다.
  - 내 무기 공격 → 몬스터 피격 → 몬스터 룰렛 → 내 무기 피격 흐름을 구현했습니다.
- PVP에 4개 방 로비를 추가했습니다.
  - 방 입장 후 AI 상대와 결투할 수 있습니다.
  - 상대 무기는 좌우반전되어 서로 마주 보는 형태입니다.
- localStorage 저장은 유지됩니다.

## 에셋 위치

```txt
public/assets/weapons/
public/assets/effects/
```

## 테스트 체크

- 강화 버튼 클릭 후 무기 진화 연출 확인
- PVE에서 내 룰렛과 몬스터 룰렛 동작 확인
- PVP에서 4개 방 로비와 방 입장 확인
- 공격 후 무기가 원위치로 복귀하는지 확인
- 피격 이펙트가 자동으로 사라지는지 확인

## v0.5 Patch Notes

- 룰렛 결과를 `turnResult` 단일 객체로 통일했습니다. 룰렛 표시, 메시지, 데미지, 이펙트, HP 감소가 같은 result를 기준으로 동작합니다.
- 룰렛 정지 시 결과를 먼저 확정하고, 해당 결과 구간으로 룰렛이 멈추도록 보정했습니다.
- miss 결과에서는 공격 모션, 피격 이펙트, 데미지가 발생하지 않도록 분리했습니다.
- 파리채/전기모기채 등 일부 무기용 개별 crop/scale/offset 설정을 추가했습니다.
- 강화 화면에서 PNG 강화 이펙트 의존도를 줄이고 CSS 암전/플래시/실루엣 중심으로 정리했습니다.
- 강화 제단 뒤 네모난 가이드 레이어를 제거했습니다.
- PVE/PVP 무기에 floating aura/shadow/idle float 표현을 추가했습니다.
- PVE 전투 필드에서 플레이어 무기와 몬스터의 위치를 더 분리했습니다.
- 초기 localStorage hydrate 후 렌더링되도록 App 초기화를 안정화했습니다.

### Recommended run command

```cmd
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```


## v0.6 Patch Notes - Battle Timing + Swing Pivot + Enhance Failure Feedback

- 강화 재화 부족 시 버튼이 비활성화되도록 수정했습니다.
- 골드 부족 / 강화석 부족 / 최대 강화 / 강화 중 상태별 버튼 문구를 분리했습니다.
- 강화 실패 연출을 “빛이 모이다가 꺼지는” 형태로 보강했습니다.
- 강화 하락 연출에 붉은 균열, 흔들림, crack overlay를 추가했습니다.
- 수호 주문서 발동 시 푸른 보호막 연출이 보이도록 보강했습니다.
- PVE 룰렛 결과 공개 후 바로 공격하지 않고, 결과 공개 → 짧은 대기 → 액션 실행 순서로 조정했습니다.
- PVE 내 무기를 왼쪽 아래 진영으로 재배치했습니다.
- 무기 공격을 단순 전진이 아니라 `weapon-unit` + `weapon-pivot` 구조의 회전축 기반 휘두르기 연출로 변경했습니다.
- miss 판정은 공격하지 않고, 실패 전용 흔들림/땀방울 연출만 실행되도록 유지했습니다.
- 몬스터 턴도 결과 공개 후 액션이 실행되도록 리듬을 맞췄습니다.
- stop 중복 클릭 및 전투 중 입력 꼬임을 줄이도록 phase 잠금 조건을 보강했습니다.

### 실행 권장

```cmd
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```


## v0.7 Patch Notes - PVE Field Position + Defeat Feedback

- PVE 내 무기 기본 위치를 왼쪽 아래 진영으로 이동했습니다.
- 공격할 때만 몬스터 방향으로 진입하고, 공격 후 원위치로 복귀하도록 이동값을 재조정했습니다.
- 플레이어 패배 상태를 `playerDying → defeatReveal → defeatResult` 흐름으로 분리했습니다.
- 패배 시 무기 쓰러짐/기절 연출, 화면 어두움, 패배 배너를 추가했습니다.
- 패배 위로금은 한 번만 지급되도록 `endedRef` 흐름을 유지했습니다.
- 패배 후 `다시 도전` / `강화하러 가기` 버튼을 추가했습니다.
- 다시 도전 시 HP, 룰렛, 이펙트, 패배 오버레이 상태가 초기화되도록 했습니다.
- 강화 화면과 PVP 대규모 구조는 건드리지 않았습니다.

### 실행 권장

```cmd
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```


## v0.7b Patch Notes - PVE Player Weapon Scale + Anchor Polish

- PVE 배틀 화면의 플레이어 무기 scale을 약 15~25% 줄였습니다.
- 플레이어 무기 idle 위치를 더 왼쪽 아래 진영으로 이동했습니다.
- 무기 본체와 aura ring / shadow가 한 세트처럼 보이도록 anchor와 위치를 보정했습니다.
- 작은 무기 scale에 맞춰 공격 이동 거리와 impact 위치를 재조정했습니다.
- 패배 연출이 새 위치에서 깨지지 않도록 collapse 위치를 보정했습니다.
- 강화 화면, PVP, 룰렛 판정 로직, turnResult 구조는 건드리지 않았습니다.

## v0.8 Patch Notes - React Combat FX Replacement + Battle Emotion Polish

- PVE 공격/피격 PNG 이펙트 의존도를 줄이고 React/CSS 기반 `CombatFx` 컴포넌트를 추가했습니다.
- `CombatFx`는 `miss`, `light`, `heavy`, `special`, `victory`, `defeat` 타입을 CSS 애니메이션으로 표시합니다.
- `FloatingText` 컴포넌트를 추가해 공격 결과와 HP 감소를 타격 위치 근처에 표시합니다.
- 약공격은 작은 별/짧은 플래시, 강공격은 큰 충격/링/흔들림, 필살기는 암전/플래시/스크린 흔들림으로 구분했습니다.
- PVE에서 기존 `EffectPlayer` 기반 피격 PNG 호출을 제거하고 `turnResult.result`와 동일한 타입의 `CombatFx`를 실행하도록 변경했습니다.
- 몬스터 피격 리액션을 `hit-light`, `hit-heavy`, `hit-special` CSS 클래스로 분리했습니다.
- 승리 연출도 CSS 별/먼지 기반으로 보강했습니다.

### 실행 권장

```cmd
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```

## v0.8a Weapon Sprite Asset Replacement Patch

- 0강~19강 무기 스프라이트를 새 버전으로 교체했습니다.
- 20강 앵그리빡빡의 광휘봉은 기존 원본을 유지했습니다.
- 게임 로직 변경 없음.
- 강화/PVE/PVP/룰렛/CombatFx 로직 변경 없음.

## v0.8b Monster Asset Strong Mapping Patch
- 몬스터 10종 PNG 이미지를 `public/assets/monsters/`에 추가
- 기존 몬스터 데이터에 `file` 경로 연결
- 몬스터 이름 기준으로 이미지 강제 매핑
- 첨부 이미지 순서와 최종 파일명 규칙이 다르므로 이름 기준 매핑 적용
- 게임 로직 변경 없음
- 강화/PVE/PVP/룰렛/CombatFx 로직 변경 없음

## v0.8d Responsive Weapon Sprite Renderer + PVE Monster Stage Anchor Polish Patch

- SpritePlayer를 이미지 실제 `naturalWidth` / `naturalHeight` 기반 동적 프레임 계산 방식으로 개선했습니다.
- 6프레임 가로형 스프라이트 시트의 `frameWidth = naturalWidth / 6`, `frameHeight = naturalHeight` 계산을 적용했습니다.
- 고해상도 무기 PNG가 기존 192x192 고정 렌더러에서 옆으로 늘어나 보이던 문제를 완화했습니다.
- 파리채, 전기모기채, 사신의 낫 등 길거나 넓은 무기가 잘리지 않도록 crop 값을 최소화하고 scale 값을 별도 보정했습니다.
- `weaponRenderConfig`에 `cardScale`, `altarScale`, `battleScale`, `pivotX`, `pivotY` 등 화면별 보정값을 추가했습니다.
- `MonsterSprite` 컴포넌트와 `monsterRenderConfig`를 추가해 PVE 몬스터 본체/그림자/말풍선 기준점을 정리했습니다.
- PVE 몬스터가 VS 영역을 과하게 침범하지 않도록 오른쪽 위 진영 기준으로 stage 위치와 shadow anchor를 보정했습니다.
- 기존 강화/PVE/PVP/룰렛/랭킹/CombatFx 로직은 변경하지 않았습니다.

## v0.8e PVE Battle Unit Scale + HP Badge Visibility + Hit Reaction Polish Patch

- PVE 전투 화면에서 플레이어/몬스터 HP와 이름표를 `battle-unit-hud` 영역으로 분리해 스프라이트/피격 애니메이션에 가려지지 않도록 보정했습니다.
- 내 무기가 플레이어 본체처럼 더 잘 보이도록 전투 스케일을 보정했습니다. 긴 무기(파리채, 전기모기채, 암흑 낫, 서리 창)는 과확대 대신 안전한 확대율을 적용했습니다.
- 몬스터 하단의 불필요한 문구/말풍선 렌더링을 제거했습니다.
- 몬스터 피격 시 wrapper transform이 덮여 몬스터가 커지거나 튀어 보이는 문제를 방지하기 위해 hit animation을 몬스터 스프라이트 이미지에만 적용하도록 정리했습니다.
- light/heavy/special 피격 반응을 전체 확대가 아닌 흔들림, 밀림, 밝기 플래시, 짧은 squash, special 충격 링 중심으로 개선했습니다.
- PVP 화면은 “준비중 🔒” 잠금 화면으로 유지했습니다. 기존 PVP 내부 코드는 삭제하지 않고 보존했습니다.
- 전투 판정, 룰렛 확률표, 강화 밸런스, 몬스터 HP/보상/층수 진행 밸런스는 변경하지 않았습니다.

### 검증

- `npm install` 실행 후 `npm run build` 통과 확인.
- PVE 화면 관련 컴포넌트와 CSS 수정 범위를 확인했습니다.
- PVP 진입 시 잠금 화면이 표시되도록 확인했습니다.
- 랭킹/전투 판정/localStorage 저장 key는 이번 패치에서 변경하지 않았습니다.


## v0.8f Weapon Ground Anchor + Player Presence Polish Patch

- PVE 전투 화면에서 플레이어 무기가 공중에 떠 보이는 문제를 개선했습니다.
- 무기 본체를 바닥 링 기준으로 더 자연스럽게 배치하도록 battle offset과 arena anchor를 보정했습니다.
- 무기 스케일은 v0.8e 기준을 유지하고, 추가 확대 대신 offsetX/offsetY와 pivot 기준으로 접지감을 조정했습니다.
- HP HUD는 v0.8e의 분리 구조를 유지해 다시 스프라이트에 가려지지 않도록 했습니다.
- 공격 모션은 새 grounded origin 기준으로 복귀하도록 lunge path를 보정했습니다.
- 긴 무기류의 비율/잘림 방지 원칙을 유지했습니다.
- PVP “준비중 🔒” 잠금 상태와 현재 ZIP 기준 랭킹/localStorage 구조는 변경하지 않았습니다.

검증:
- `pnpm build` 통과
- PVE 전투 화면 관련 CSS/컴포넌트 수정 범위 확인
- 전투 판정/룰렛 확률/강화 밸런스 미변경

실행:
```bash
pnpm install
pnpm dev
```

빌드 확인:
```bash
pnpm build
```

## v0.9 Ranking Page UI Rebuild + Mock Ranking Service Patch

변경 내용:
- 신규 랭킹 페이지 UI를 추가했습니다.
- 내 랭킹 요약 카드, 종합/최고층/최고강화/처치수/명예의 전당 탭을 추가했습니다.
- TOP 3 랭킹 카드와 4~10위 랭킹 테이블을 추가했습니다.
- 최근 기록 패널과 명예의 전당 미니 패널을 추가했습니다.
- `src/data/mockRankings.js`에 Mock ranking data를 추가했습니다.
- `src/services/rankingService.js`를 추가해 나중에 API로 전환하기 쉬운 구조를 만들었습니다.
- 현재 단계에서는 실제 API/DB/Discord OAuth/Discord Bot을 구현하지 않았습니다.
- PVP “준비중 🔒” 잠금 상태를 유지했습니다.
- 전투 판정, 룰렛 확률, 강화 밸런스, 몬스터 밸런스는 변경하지 않았습니다.
- 기존 localStorage key는 변경하지 않았습니다.

검증:
- 랭킹 탭 진입 확인 대상 추가
- 랭킹 탭 전환 확인 대상 추가
- TOP 3 카드, 랭킹 테이블, 최근 기록 표시 확인 대상 추가
- PVP 잠금 상태 유지 확인 대상 추가

실행:
```bash
pnpm install
pnpm dev
```

빌드 확인:
```bash
pnpm build
```

## v0.9 Ranking Page Weapon Identity + Deploy Ready Patch

변경 내용:
- 랭킹 페이지에 실제 게임 무기 스프라이트 이미지를 반영했습니다.
- TOP 3 카드의 대표 무기를 이모지/임시 아이콘 대신 실제 무기 이미지로 표시했습니다.
- 4~10위 랭킹 테이블의 대표 무기 컬럼에 실제 무기 썸네일을 추가했습니다.
- 내 랭킹 요약 카드에 현재 대표 무기 이미지를 크게 표시했습니다.
- 최근 기록 패널의 강화 성공/실패 로그에 관련 무기 썸네일을 표시했습니다.
- 명예의 전당에 시즌 우승 무기 이미지를 함께 표시했습니다.
- `RankingWeaponSprite` 컴포넌트를 추가해 전투용 SpritePlayer와 분리된 랭킹 전용 정지 무기 렌더러를 만들었습니다.
- 랭킹 데이터의 `representativeWeapon` 구조를 실제 무기 asset 경로와 연결 가능한 객체 형태로 보강했습니다.
- API/DB/Discord OAuth/Discord Bot은 아직 구현하지 않았고, 추후 API 전환이 쉬운 구조만 유지했습니다.
- 개발 서버 5174 / 테스트 서버 5173 기준 실행 안내를 추가했습니다.
- PVP “준비중 🔒” 상태, 전투 판정, 룰렛 확률, 강화 밸런스, PVE 밸런스는 변경하지 않았습니다.

검증:
- 랭킹 페이지 진입 시 TOP 3 무기 이미지 표시 확인 대상입니다.
- 테이블 대표 무기 썸네일 표시 확인 대상입니다.
- 긴 무기류는 랭킹 전용 contain 렌더링으로 잘림을 최소화했습니다.
- 배포 전 `pnpm build` 확인이 필요합니다.

실행:
```bash
pnpm install
pnpm dev --port 5174
```

테스트 서버:
```bash
pnpm dev --host 0.0.0.0 --port 5173
```

빌드 확인:
```bash
pnpm build
```

정적 배포 설정:
```txt
Build Command: pnpm build
Output Directory: dist
```

## v0.9a Ranking Data Normalize + Weapon Fallback Deploy Hotfix

변경 내용:
- 랭킹 데이터 정규화 로직을 추가/보강했습니다.
- 기존 localStorage 랭킹 데이터 구조가 달라도 화면이 깨지지 않도록 안전 처리했습니다.
- `representativeWeapon`이 없거나 불완전할 때 기존 무기명/강화 수치/현재 무기 정보에서 복구하도록 했습니다.
- 실제 weapon asset 매칭 fallback을 보강해 `무기 없음`, `층`, `+` 같은 깨진 출력이 남발되지 않도록 했습니다.
- TOP 3 카드에 빈 데이터가 억지 출력되지 않도록 수정하고, 데이터가 부족하면 “도전자 대기중” 카드가 표시되게 했습니다.
- 4~10위 테이블에 빈 행이 생성되지 않도록 수정하고, 데이터 부족 시 안내 메시지를 표시합니다.
- 최근 기록 패널에서 message가 없을 때 기본 문구를 생성하도록 수정했습니다.
- 개발 서버 5174 / 테스트 서버 5173 기준을 유지했습니다.
- PVP “준비중 🔒” 상태를 유지했습니다.
- 전투/강화/PVE 로직, 룰렛 확률, 강화 밸런스, PVE 밸런스는 변경하지 않았습니다.
- API/DB/Discord OAuth/Discord Bot은 구현하지 않았습니다.

검증:
- `npm run build` 통과 확인.
- 랭킹 페이지에서 빈 유저명, `무기 없음`, `층`, `+`가 직접 노출되지 않도록 fallback 처리.
- 최근 기록 텍스트 fallback 처리.

개발 서버:
```bash
pnpm install
pnpm dev --port 5174
```

테스트 서버:
```bash
pnpm dev --host 0.0.0.0 --port 5173
```

빌드 확인:
```bash
pnpm build
```

정적 배포 설정:
```txt
Build Command: pnpm build
Output Directory: dist
```
