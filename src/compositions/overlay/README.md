# compositions/overlay

구 `re-overlay` 저장소에서 통합된 크로마키·오버레이 템플릿 모음.

## 컴포지션

| ID | 용도 |
|----|------|
| `HumanvilleOverlay` / `HumanvilleChromakey` | 휴먼빌 영상 전체 (820s @ 30fps) |
| `Panel-<id>` (다수) | `humanvilleData.사이드패널` 개별 클립 |
| `Sub-<idx>` (다수) | `humanvilleData.포인트자막` 개별 클립 |

## 디렉토리

- `HumanvilleOverlay.tsx` / `HumanvilleChromakey.tsx` — 컴포지션 루트
- `Overlay.tsx` — Roboto 폰트 로딩 유틸
- `components/PointSubtitle.tsx`, `SidePanel.tsx` — 오버레이 조각
- `data/humanville.ts` — 휴먼빌 시퀀스 데이터 (사이드패널·포인트자막 타임라인)

원본은 `remotion-dev/template-overlay` 공식 템플릿 포크에서 파생.
