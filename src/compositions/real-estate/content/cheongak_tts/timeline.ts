import { InfoCardConfig } from "../../components/InfoCardOverlay";

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

export const AUDIO_FILE = "cheongak_tts/audio.mp3";
const DRONE_FILE = "drone/drone_ch.mp4"; // 472초짜리 단일 파일

// 드론 영상 하나로 전체 7분 30초 커버
// videoOffset: 드론 파일 내 시작 지점(초) — 다양한 장면 활용
export const DRONE_CLIPS = [
  { id: "d1", src: DRONE_FILE, startFrame: sec(0),   durationFrames: sec(45),  videoOffset: 0   },
  { id: "d2", src: DRONE_FILE, startFrame: sec(45),  durationFrames: sec(75),  videoOffset: 45  },
  { id: "d3", src: DRONE_FILE, startFrame: sec(120), durationFrames: sec(60),  videoOffset: 120 },
  { id: "d4", src: DRONE_FILE, startFrame: sec(180), durationFrames: sec(60),  videoOffset: 180 },
  { id: "d5", src: DRONE_FILE, startFrame: sec(240), durationFrames: sec(60),  videoOffset: 240 },
  { id: "d6", src: DRONE_FILE, startFrame: sec(300), durationFrames: sec(120), videoOffset: 300 },
  { id: "d7", src: DRONE_FILE, startFrame: sec(420), durationFrames: sec(30),  videoOffset: 420 },
];

// ── 인포카드 타임라인 ──────────────────────────────────────
const INFO_CARDS: InfoCardConfig[] = [
  {
    id: "card_section1",
    startFrame: sec(35),
    durationFrames: sec(40),
    tag: "청약통장 해지 현황",
    position: "right",
    items: [
      { label: "최고 가입자 수 (2022.06)", value: "2,859만 명" },
      { label: "현재 (2026.03)",           value: "2,600만 명대", highlight: true },
      { label: "이탈 규모",                value: "200만 명 이상" },
      { label: "2026년 1분기 해지",        value: "91만 명",      highlight: true },
    ],
  },
  {
    id: "card_section2_score",
    startFrame: sec(155),
    durationFrames: sec(40),
    tag: "서울 청약 65점 조건",
    position: "right",
    items: [
      { label: "무주택 기간 (만 30세~)", value: "15년 이상" },
      { label: "통장 가입 기간",         value: "15년 이상" },
      { label: "부양가족",               value: "배우자 + 자녀 2명" },
      { label: "도달 나이",              value: "45세",           highlight: true },
    ],
  },
  {
    id: "card_section2_solo",
    startFrame: sec(200),
    durationFrames: sec(28),
    tag: "1인 가구 최대 가점",
    position: "bottom",
    items: [
      { label: "무주택 만점",    value: "32점" },
      { label: "통장 가입 만점", value: "17점" },
      { label: "부양가족 없음",  value: "0점" },
      { label: "합계",           value: "54점 — 65점 불가", highlight: true },
    ],
  },
  {
    id: "card_section3",
    startFrame: sec(255),
    durationFrames: sec(42),
    tag: "해지 전 확인",
    position: "right",
    items: [
      { label: "5년 이내 해지 추징", value: "납입액의 6%" },
      { label: "무주택·가입기간",   value: "전부 소멸",     highlight: true },
      { label: "담보대출 금리",      value: "3%대" },
      { label: "대출 한도",          value: "예금액의 90%+" },
    ],
  },
  {
    id: "card_buldang",
    startFrame: sec(310),
    durationFrames: sec(50),
    tag: "불당동 — 증명된 사례",
    position: "right",
    items: [
      { label: "당시 분양가 (84㎡)", value: "4억 3,000만 원" },
      { label: "프리미엄",           value: "1억 3,000만 원+", highlight: true },
      { label: "현 실거래 (100㎡)", value: "8억 2,000만 원",  highlight: true },
      { label: "현재 시세",          value: "8억~12억" },
    ],
  },
  {
    id: "card_deposit",
    startFrame: sec(425),
    durationFrames: sec(38),
    tag: "민영주택 예치금 비교",
    position: "bottom",
    items: [
      { label: "서울·부산 (모든 면적)", value: "1,500만 원" },
      { label: "서울·부산 (85㎡ 이하)", value: "300만 원" },
      { label: "천안아산 (85㎡ 이하)",  value: "200만 원",  highlight: true },
      { label: "천안아산 (전 면적)",    value: "600만 원",  highlight: true },
    ],
  },
  {
    id: "card_eligibility",
    startFrame: sec(668),
    durationFrames: sec(42),
    tag: "천안아산 청약 자격",
    position: "right",
    items: [
      { label: "충남·대전·세종", value: "기타지역 1순위 가능" },
      { label: "통장 가입",      value: "6개월 이상",           highlight: true },
      { label: "수도권 이주 시", value: "전입신고 즉시 해당지역", highlight: true },
      { label: "전매제한",       value: "없음 (비규제지역)" },
    ],
  },
];

// ── 막대 차트 타임라인 ─────────────────────────────────────
export interface BarChartConfig {
  id: string;
  startFrame: number;
  durationFrames: number;
  title: string;
  bars: { label: string; value: number; highlight?: boolean }[];
  unit: string;
  maxValue: number;
}

const BAR_CHARTS: BarChartConfig[] = [
  {
    id: "chart_longterm",
    startFrame: sec(75),
    durationFrames: sec(28),
    title: "5년 이상 장기가입자 해지 건수",
    unit: "만 건",
    maxValue: 30,
    bars: [
      { label: "2022.09", value: 10.9 },
      { label: "2023.09", value: 18.2 },
      { label: "2024",    value: 27.9, highlight: true },
    ],
  },
  {
    id: "chart_competition",
    startFrame: sec(128),
    durationFrames: sec(28),
    title: "서울 청약 경쟁률 (대 1)",
    unit: ":1",
    maxValue: 1200,
    bars: [
      { label: "서울 평균",      value: 147 },
      { label: "오티에르 반포",  value: 710 },
      { label: "아크로 드 서초", value: 1099, highlight: true },
    ],
  },
  {
    id: "chart_price",
    startFrame: sec(355),
    durationFrames: sec(38),
    title: "불당 vs 성성 가격 비교 (억 원)",
    unit: "억",
    maxValue: 13,
    bars: [
      { label: "불당 분양가 (당시)", value: 4.3 },
      { label: "불당 현재 시세",     value: 10,  highlight: true },
      { label: "성성 기존 아파트",   value: 6 },
      { label: "성성 신규 분양",     value: 4.5, highlight: true },
    ],
  },
];

export const cheongakTimelineData = {
  infoCards: INFO_CARDS,
  barCharts: BAR_CHARTS,
};
