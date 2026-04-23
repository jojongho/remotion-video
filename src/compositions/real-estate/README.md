# compositions/real-estate

구 `remotion-real-estate` 저장소에서 통합된 부동산 현장 영상 컴포지션 모음.

## 주요 컴포지션 (Root.tsx 등록)

| ID | 용도 |
|----|------|
| `AreaExplainer-Auto` / `AreaExplainer-Face` | "84㎡인데 왜 좁아 보이나요?" 풀링 시리즈 |
| `CheongakGajum` | 청약 가점 계산 가이드 (Phase 1 #1) |
| `TangjeongVideo` | 탕정 동일하이빌 파크레인 |
| `HumanvilFirstCity` | 천안 휴먼빌 퍼스트시티 (데이터 기반 버전) |
| `Template-PropertyInfo-A` / `-B` | 사업개요 템플릿 미리보기 |
| `RealEstate-SampleProject` | config 기반 샘플 |
| `RealEstate-RaonPrivate` | config 기반 라온프라이빗 |

## ⚠️ 렌더링을 위한 외부 에셋 복원

대용량 미디어(mp4·wav·이미지·footage) 및 일부 프로젝트 자산은 `~/Movies/remotion-content/from-remotion-real-estate/` 에 분리 보관됨.

렌더 시 필요한 에셋을 `remotion-video/public/` 하위에 수동 복사하거나 심볼릭 링크해야 함:

```bash
# 예: 라온프라이빗 에셋 복원
cp -R ~/Movies/remotion-content/from-remotion-real-estate/content/002_raon_private/* \
      public/real-estate/002_raon_private/

# 예: public 통째로 심볼릭 링크
ln -s ~/Movies/remotion-content/from-remotion-real-estate/public/audio public/audio
ln -s ~/Movies/remotion-content/from-remotion-real-estate/public/narration public/narration
ln -s ~/Movies/remotion-content/from-remotion-real-estate/public/subtitles.srt public/subtitles.srt
```

## 디렉토리

- `*.tsx` — 컴포지션 루트 컴포넌트
- `components/` — 재사용 오버레이 (InfoBox, BadgeOverlay, MediaSlide, HighlightCaption 등 10종)
- `compositions/RealEstateTemplate.tsx` — config 기반 범용 템플릿
- `templates/PropertyInfo*` — 사업개요 프리셋 2종
- `content/<project>/config.json` — 프로젝트별 시나리오 설정 (경량 JSON)
- `styles/presets.ts` — 디자인 토큰 (TOKENS)
- `styles/*.md` — 모션·스타일 가이드
- `utils/parseSrt.ts` — SRT → SubtitleCue 변환
