import React from 'react';
import { AbsoluteFill, Sequence, Video, staticFile } from 'remotion';
import {
  HilstateEmphasisSubtitle,
  HilstatePointSubtitle,
  HilstateTitleCard,
  SRTSubtitleTrack,
} from '../components/HilstateComponents';

// ──────────────────────────────────────────────────────────────
// 타이밍 상수 (30fps 기준, ms → frame = ms * 30 / 1000)
// ──────────────────────────────────────────────────────────────

// 타이틀 카드 구간
const TITLE_CARDS = [
  { from: 0,     duration: 120, mainTitle: '마피 매물 전수 분석', subTitle: '5월 입주 예정 · 134건 완전 분석' },
  { from: 2043,  duration: 90,  mainTitle: '단지 기본 정보',       subTitle: '힐스테이트 모종 블랑루체' },
  { from: 4540,  duration: 90,  mainTitle: '원분양가 분석',         subTitle: '84타입 · 109타입 발코니 포함' },
  { from: 6732,  duration: 90,  mainTitle: '매물 현황',             subTitle: '4월 13일 기준 · 한달 만에 2배' },
  { from: 16692, duration: 90,  mainTitle: '마피가 나오는 이유',    subTitle: '구조적 분석 3가지' },
  { from: 18900, duration: 90,  mainTitle: '단지 강점',             subTitle: '매수 · 전세 포인트 정리' },
];

// 강조 자막 구간
const EMPHASIS_MOMENTS = [
  { from: 990,  duration: 81, text: '한달 만에 마피 2배!',         subText: '34건 → 69건',          theme: 'yellow' as const },
  { from: 1191, duration: 57, text: '최대 4,000만원 마이너스핏',   subText: undefined,              theme: 'red'    as const },
  { from: 8330, duration: 90, text: '전체 매물 76% 원분양가 이하', subText: '마피 매물 69건 포함',  theme: 'yellow' as const },
  { from: 8509, duration: 78, text: '마피 평균 1,853만원',          subText: undefined,              theme: 'red'    as const },
];

// 포인트 자막 구간
const POINT_MOMENTS = [
  {
    from: 1266, duration: 120,
    badge: 'POINT', title: '국민평형 84타입',
    description: '실매매가 4억 초반',
    side: 'left' as const, accentColor: '#1A56DB',
  },
  {
    from: 1453, duration: 120,
    badge: 'POINT', title: '신축 전세 매물',
    description: '2억 4천만원~부터',
    side: 'right' as const, accentColor: '#059669',
  },
  {
    from: 12690, duration: 120,
    badge: 'POINT', title: '옵션 꿀 매물',
    description: '에어컨·인덕션·비스포크 시공\n실질 마피 4,000~5,000만원 효과',
    side: 'left' as const, accentColor: '#D97706',
  },
  {
    from: 16913, duration: 90,
    badge: '이유 ①', title: '입주장 잔금 임박',
    description: '5월 입주 잔금 한번에 납부\n대출·기존 집 미처분 시 급매',
    side: 'left' as const, accentColor: '#DC2626',
  },
  {
    from: 17199, duration: 90,
    badge: '이유 ②', title: '1,054세대 동시입주',
    description: '일시적 매물 집중\n당연한 시장 현상',
    side: 'right' as const, accentColor: '#DC2626',
  },
  {
    from: 17460, duration: 90,
    badge: '이유 ③', title: '아산 6,500세대',
    description: '26년 아산시 신규입주 물량\n지역 전체 공급 집중',
    side: 'left' as const, accentColor: '#DC2626',
  },
];

// ──────────────────────────────────────────────────────────────
// 메인 컴포지션
// ──────────────────────────────────────────────────────────────
export const HilstateVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 원본 영상 */}
      <Video
        src={staticFile('힐스테이트모종 블랑루체.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' } as React.CSSProperties}
      />

      {/* 일반 자막 (SRT 전체 구간) */}
      <SRTSubtitleTrack />

      {/* 타이틀 카드 */}
      {TITLE_CARDS.map((t, i) => (
        <Sequence key={`title-${i}`} from={t.from} durationInFrames={t.duration}>
          <HilstateTitleCard mainTitle={t.mainTitle} subTitle={t.subTitle} />
        </Sequence>
      ))}

      {/* 강조 자막 */}
      {EMPHASIS_MOMENTS.map((e, i) => (
        <Sequence key={`emphasis-${i}`} from={e.from} durationInFrames={e.duration}>
          <HilstateEmphasisSubtitle text={e.text} subText={e.subText} theme={e.theme} />
        </Sequence>
      ))}

      {/* 포인트 자막 */}
      {POINT_MOMENTS.map((p, i) => (
        <Sequence key={`point-${i}`} from={p.from} durationInFrames={p.duration}>
          <HilstatePointSubtitle
            badge={p.badge}
            title={p.title}
            description={p.description}
            side={p.side}
            accentColor={p.accentColor}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
