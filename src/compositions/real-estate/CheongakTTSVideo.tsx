import React from "react";
import {
  AbsoluteFill, Audio, Sequence, Video, staticFile, useVideoConfig,
} from "remotion";
import { SubtitleOverlay } from "./components/SubtitleOverlay";
import { HookMotionGraphic } from "./components/HookMotionGraphic";
import { CinematicStatCard, CinematicStatCardConfig } from "./components/CinematicStatCard";
import { CinematicBarChart } from "./components/CinematicBarChart";
import { subtitleCues } from "./content/cheongak_tts/cues";
import { DRONE_CLIPS, AUDIO_FILE, BarChartConfig } from "./content/cheongak_tts/timeline";

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// ── 인포카드 (CinematicStatCard용으로 재정의) ─────────────
const STAT_CARDS: CinematicStatCardConfig[] = [
  {
    id: "stat1",
    startFrame: sec(35),
    durationFrames: sec(40),
    tag: "청약통장 해지 현황",
    layout: "top-center",
    columns: 4,
    items: [
      { label: "2022년 최고치",          value: "2,859만 명" },
      { label: "2026년 현재",            value: "2,600만 명대", highlight: true, accent: "red" },
      { label: "이탈 규모",              value: "200만 명 이상" },
      { label: "2026년 1분기 해지",      value: "91만 명",      highlight: true, accent: "yellow" },
    ],
  },
  {
    id: "stat2",
    startFrame: sec(155),
    durationFrames: sec(42),
    tag: "서울 청약 65점 조건",
    layout: "top-right",
    columns: 2,
    items: [
      { label: "무주택 기간 (만 30세~)", value: "15년 이상" },
      { label: "통장 가입",              value: "15년 이상" },
      { label: "부양가족",               value: "배우자 + 자녀 2명" },
      { label: "도달 나이",              value: "45세",        highlight: true, accent: "red" },
    ],
  },
  {
    id: "stat3",
    startFrame: sec(200),
    durationFrames: sec(28),
    tag: "1인 가구 최대 가점",
    layout: "top-center",
    columns: 4,
    items: [
      { label: "무주택 만점",    value: "32점" },
      { label: "통장 가입 만점", value: "17점" },
      { label: "부양가족 없음",  value: "0점" },
      { label: "합계 (당첨선 65점 불가)", value: "54점", highlight: true, accent: "red" },
    ],
  },
  {
    id: "stat4",
    startFrame: sec(258),
    durationFrames: sec(40),
    tag: "해지 전 확인사항",
    layout: "top-center",
    columns: 4,
    items: [
      { label: "5년 이내 해지 추징", value: "납입액 6%",  highlight: true, accent: "red" },
      { label: "무주택·가입기간",   value: "전부 소멸",   highlight: true, accent: "red" },
      { label: "담보대출 금리",      value: "3%대" },
      { label: "대출 한도",          value: "예금액 90%+", accent: "green" },
    ],
  },
  {
    id: "stat5",
    startFrame: sec(312),
    durationFrames: sec(48),
    tag: "불당동 — 증명된 사례",
    layout: "top-right",
    columns: 2,
    items: [
      { label: "당시 분양가 (84㎡)", value: "4억 3천만원" },
      { label: "프리미엄",           value: "1억 3천만원+",  highlight: true, accent: "yellow" },
      { label: "현 실거래 (100㎡)", value: "8억 2천만원",   highlight: true, accent: "yellow" },
      { label: "현재 시세 범위",     value: "8억~12억" },
    ],
  },
  {
    id: "stat6",
    startFrame: sec(425),
    durationFrames: sec(36),
    tag: "민영주택 예치금 비교",
    layout: "top-center",
    columns: 4,
    items: [
      { label: "서울·부산 (모든 면적)", value: "1,500만원" },
      { label: "서울·부산 (85㎡ 이하)", value: "300만원" },
      { label: "천안아산 (85㎡ 이하)",  value: "200만원",  highlight: true, accent: "green" },
      { label: "천안아산 (전 면적)",    value: "600만원",  highlight: true, accent: "green" },
    ],
  },
  {
    id: "stat7",
    startFrame: sec(468),
    durationFrames: sec(42),
    tag: "천안아산 청약 자격",
    layout: "top-center",
    columns: 4,
    items: [
      { label: "충남·대전·세종",  value: "기타지역 1순위" },
      { label: "통장 가입 기간",  value: "6개월 이상",      highlight: true, accent: "green" },
      { label: "수도권 이주 시",  value: "전입신고 즉시",   highlight: true, accent: "green" },
      { label: "전매제한",        value: "없음",             accent: "green" },
    ],
  },
];

// ── 차트 (CinematicBarChart용) ─────────────────────────────
const BAR_CHARTS: (BarChartConfig & { durationFrames: number })[] = [
  {
    id: "c1", startFrame: sec(75), durationFrames: sec(28),
    title: "5년 이상 장기가입자 해지 건수",
    unit: "만 건", maxValue: 30,
    bars: [
      { label: "2022.09", value: 10.9 },
      { label: "2023.09", value: 18.2 },
      { label: "2024",    value: 27.9, highlight: true },
    ],
  },
  {
    id: "c2", startFrame: sec(118), durationFrames: sec(28),
    title: "서울 청약 경쟁률 (대 1)",
    unit: ":1", maxValue: 1200,
    bars: [
      { label: "서울 평균",      value: 147 },
      { label: "오티에르 반포",  value: 710 },
      { label: "아크로 드 서초", value: 1099, highlight: true },
    ],
  },
  {
    id: "c3", startFrame: sec(358), durationFrames: sec(36),
    title: "불당 vs 성성 가격 비교 (억 원)",
    unit: "억", maxValue: 13,
    bars: [
      { label: "불당 당시 분양가", value: 4.3 },
      { label: "불당 현재 시세",   value: 10,  highlight: true },
      { label: "성성 기존 아파트", value: 6 },
      { label: "성성 신규 분양",   value: 4.5, highlight: true },
    ],
  },
];

export const CheongakTTSVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* ── 레이어 1: 드론 영상 배경 ── */}
      {DRONE_CLIPS.map((clip) => (
        <Sequence key={clip.id} from={clip.startFrame} durationInFrames={clip.durationFrames}>
          <Video
            src={staticFile(clip.src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" as const }}
            startFrom={Math.round((clip.videoOffset ?? 0) * fps)}
            volume={0}
          />
        </Sequence>
      ))}

      {/* ── 레이어 2: ElevenLabs TTS 오디오 ── */}
      <Audio src={staticFile(AUDIO_FILE)} />

      {/* ── 레이어 3: 훅 모션 그래픽 (도입부 0~30초) ── */}
      {/* Phase 1: "서울 청약 당첨 안 됩니다" (0~5초) */}
      <Sequence from={0} durationInFrames={sec(5)}>
        <HookMotionGraphic phase={1} />
      </Sequence>
      {/* Phase 2: "91만 명" 숫자 충격 (12~20초) */}
      <Sequence from={sec(12)} durationInFrames={sec(8)}>
        <HookMotionGraphic phase={2} />
      </Sequence>
      {/* Phase 3: "그 통장, 쓸 곳이 있습니다" (22~30초) */}
      <Sequence from={sec(22)} durationInFrames={sec(8)}>
        <HookMotionGraphic phase={3} />
      </Sequence>

      {/* ── 레이어 4: 시네마틱 스탯 카드 ── */}
      {STAT_CARDS.map((card) => (
        <Sequence key={card.id} from={card.startFrame} durationInFrames={card.durationFrames}>
          <CinematicStatCard {...card} />
        </Sequence>
      ))}

      {/* ── 레이어 5: 시네마틱 바 차트 ── */}
      {BAR_CHARTS.map((chart) => (
        <Sequence key={chart.id} from={chart.startFrame} durationInFrames={chart.durationFrames}>
          <CinematicBarChart {...chart} />
        </Sequence>
      ))}

      {/* ── 레이어 6: 자막 (항상 최상단, 하단 고정) ── */}
      <SubtitleOverlay cues={subtitleCues} />

    </AbsoluteFill>
  );
};
