# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm run dev        # Remotion Studio 실행 (브라우저 미리보기)
npm run build      # 프로덕션 번들 생성
npm run lint       # ESLint + TypeScript 타입 체크
npm run upgrade    # Remotion 프레임워크 업그레이드
```

렌더링(CLI):
```bash
npx remotion render <CompositionId> output.mp4
npx remotion still <CompositionId> output.png --frame=0
```

## 아키텍처

React + TypeScript로 영상을 코드로 작성하는 Remotion 프레임워크 기반 프로젝트. 부동산(아이파크·아산탕정) 마케팅 유튜브 영상 및 Shorts 제작용.

**진입점 흐름:**
`src/index.ts` → `registerRoot(RemotionRoot)` → `src/Root.tsx` (컴포지션 등록)

**등록된 컴포지션 (`src/Root.tsx`):**

| ID | 해상도 | 길이 | 용도 |
|----|--------|------|------|
| `YouTubeLongform` | 1920×1080 | 10분 (30fps) | 유튜브 장편 |
| `YouTubeShorts` | 1080×1920 | 60초 (30fps) | 유튜브 Shorts |

**핵심 컴포넌트 (`src/components/KoreanSubtitles.tsx`):**
- `YouTubeEmphasisSubtitle` — 강조 자막 (빨강/노랑, 그림자 효과)
- `SpaceEntrySubtitle` — 아파트 특징 소개용 패널 자막 (라인 애니메이션)
- `SlidingInfoPanel` — 풀스크린 슬라이딩 패널 (아산탕정 브랜딩)

## 설정

- **Tailwind v4** — `remotion.config.ts`의 webpack override로 통합. 커스텀 색상은 `tailwind.config.js`에 정의
- **ipark 브랜드 색상**: `ipark-red` (#BA0C2F), `ipark-dark`, `ipark-gold` 등
- **출력 포맷**: JPEG (`remotion.config.ts`에서 설정됨)
- **커스텀 유틸리티**: `.text-shadow-md` — `src/global.css`에 정의

## 새 컴포지션 추가 방법

1. `src/compositions/` 또는 `src/components/`에 컴포넌트 작성
2. `src/Root.tsx`의 `RemotionRoot`에 `<Composition>` 추가
3. `npm run dev`로 스튜디오에서 확인
