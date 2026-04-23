import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { InfoCardOverlay, InfoCardConfig } from "./components/InfoCardOverlay";
import { BadgeOverlay, BadgeConfig } from "./components/BadgeOverlay";
import { BannerOverlay, BannerConfig } from "./components/BannerOverlay";
import { CtaOverlay } from "./components/CtaOverlay";
import {
  PointTitleOverlay,
  PointTitleConfig,
} from "./components/PointTitleOverlay";

interface HumanvilProps {
  subtitleCues?: unknown[];
}

const FPS = 30;
const sec = (s: number) => FPS * s;

// ────────────────────────────────────────────
// 타이밍 맵 (6분 19초 = 379초)
//
// 0-4s     뱃지: 천안 휴먼빌 퍼스트시티 / 84D 타입
// 2-8s     배너(하단): 단지 개요
// 15-23s   인포(우측): 분양가
// 30-36s   포인트타이틀: "분양가 및 계약조건"
// 45-55s   인포(좌측): 84D 타입 상세
// 65-71s   포인트타이틀: "붙박이장 기본제공!!"
// 80-88s   인포(우측): 구조 특장점
// 95-101s  배너(하단): 타입별 가격
// 112-120s 인포(하단): 시세 비교
// 130-136s 포인트타이틀: "핵심 포인트 ① 거실 양창"
// 150-155s 뱃지: 성성지구 메리트
// 170-178s 인포(우측): 투자 포인트
// 200-206s 배너(상단): 비규제/전매
// 220-226s 포인트타이틀: "성성지구 최저가 진입"
// 250-260s 인포(좌측): 실내 특장점
// 280-288s 인포(우측): 커뮤니티
// 310-316s 배너(하단): 메리트 요약
// 330-336s 포인트타이틀: "계약금 500만원"
// 340-350s 인포(하단): 계약 조건
// 360-379s 뱃지: 아웃트로
// ────────────────────────────────────────────

// ─── 포인트 타이틀 (큰 모션 텍스트, 화면 중앙) ───
const pointTitles: PointTitleConfig[] = [
  {
    id: "pt_price",
    startFrame: sec(30),
    durationFrames: sec(5),
    tag: "분양 안내",
    title: "분양가 및 계약조건",
    sub: "B타입은 고층 병뷰 계약가능",
  },
  {
    id: "pt_builtin",
    startFrame: sec(65),
    durationFrames: sec(5),
    title: "붙박이장 기본제공!!",
    sub: "작은방 확장 + 붙박이 기본 옵션 포함",
  },
  {
    id: "pt_living",
    startFrame: sec(130),
    durationFrames: sec(5),
    tag: "핵심 포인트 ①",
    title: "거실 양창",
    sub: "남동 남서 조망 채광 · 환기 극대화",
  },
  {
    id: "pt_cheapest",
    startFrame: sec(220),
    durationFrames: sec(5),
    title: "성성지구 최저가 진입",
    sub: "84㎡ 기준 4억대~ · 인근 대비 1억 이상 저렴",
  },
  {
    id: "pt_contract",
    startFrame: sec(330),
    durationFrames: sec(5),
    tag: "특별 프로모션",
    title: "계약금 500만원",
    sub: "100세대 한정 · 84D · 84B 추천",
  },
];

// ─── 인포카드 (사이드 + 하단 혼합) ───
const infoCards: InfoCardConfig[] = [
  {
    id: "price",
    startFrame: sec(15),
    durationFrames: sec(8),
    tag: "분양가",
    position: "right",
    items: [
      { label: "84㎡ 시작가", value: "4억 7,500만~", highlight: true },
      { label: "계약금", value: "500만원" },
      { label: "입주", value: "2029년 5월" },
    ],
  },
  {
    id: "type_d",
    startFrame: sec(45),
    durationFrames: sec(10),
    tag: "84D 타입",
    position: "left",
    items: [
      { label: "구조", value: "포베이 맞통풍" },
      { label: "알파룸", value: "방 4개 전환" },
      { label: "거실 폭", value: "5.7m 광폭", highlight: true },
    ],
  },
  {
    id: "structure",
    startFrame: sec(80),
    durationFrames: sec(8),
    tag: "구조 특장점",
    position: "right",
    items: [
      { label: "안방", value: "정사각 발코니" },
      { label: "드레스룸", value: "워크인 타입" },
      { label: "주방", value: "사각싱크볼 무상", highlight: true },
    ],
  },
  {
    id: "compare",
    startFrame: sec(112),
    durationFrames: sec(8),
    tag: "시세 비교",
    position: "bottom",
    items: [
      { label: "휴먼빌 84㎡", value: "4억대~", highlight: true },
      { label: "업성 푸르지오", value: "~1억 차이" },
      { label: "성성자이", value: "6억 이상" },
    ],
  },
  {
    id: "invest",
    startFrame: sec(170),
    durationFrames: sec(8),
    tag: "투자 포인트",
    position: "right",
    items: [
      { label: "규제", value: "비규제" },
      { label: "전매", value: "제한없음", highlight: true },
      { label: "대출", value: "70% 가능" },
    ],
  },
  {
    id: "living",
    startFrame: sec(250),
    durationFrames: sec(10),
    tag: "실내 특장점",
    position: "left",
    items: [
      { label: "거실", value: "40평대 수준", highlight: true },
      { label: "기본 옵션", value: "사각싱크볼 무상" },
      { label: "작은방", value: "확장+붙박이" },
    ],
  },
  {
    id: "community",
    startFrame: sec(280),
    durationFrames: sec(8),
    tag: "커뮤니티",
    position: "right",
    items: [
      { label: "총세대", value: "1,541세대" },
      { label: "시설", value: "대단지급", highlight: true },
      { label: "입주", value: "2029.05" },
    ],
  },
  {
    id: "contract",
    startFrame: sec(340),
    durationFrames: sec(10),
    tag: "계약 조건",
    position: "bottom",
    items: [
      { label: "계약금", value: "500만원", highlight: true },
      { label: "한정", value: "100세대 프로모션" },
      { label: "추천 타입", value: "84D · 84B" },
    ],
  },
];

// ─── 배너 띠 (하단/상단 슬라이드) ───
const banners: BannerConfig[] = [
  {
    id: "overview",
    startFrame: sec(2),
    durationFrames: sec(6),
    position: "bottom",
    items: [
      { label: "위치", value: "성성지구" },
      { label: "총세대", value: "1,541세대", highlight: true },
      { label: "평형", value: "84㎡ 4타입" },
      { label: "입주", value: "2029.05" },
    ],
  },
  {
    id: "price_band",
    startFrame: sec(95),
    durationFrames: sec(6),
    position: "bottom",
    items: [
      { label: "84A", value: "4.7억~" },
      { label: "84B", value: "4.8억~" },
      { label: "84C", value: "4.9억~" },
      { label: "84D", value: "5.0억~", highlight: true },
    ],
  },
  {
    id: "invest",
    startFrame: sec(200),
    durationFrames: sec(6),
    position: "top",
    items: [
      { label: "규제", value: "비규제" },
      { label: "전매", value: "제한없음", highlight: true },
      { label: "계약금", value: "500만원" },
      { label: "프로모션", value: "100세대 한정" },
    ],
  },
  {
    id: "merit_summary",
    startFrame: sec(310),
    durationFrames: sec(6),
    position: "bottom",
    items: [
      { label: "평면", value: "광폭거실 5.7m", highlight: true },
      { label: "구조", value: "포베이 맞통풍" },
      { label: "커뮤니티", value: "대단지급" },
      { label: "가격", value: "4억대~" },
    ],
  },
];

// ─── 뱃지 (좌상단) ───
const badges: BadgeConfig[] = [
  {
    id: "intro",
    startFrame: 0,
    durationFrames: sec(4),
    badges: ["천안 휴먼빌 퍼스트시티", "84D 타입 모델하우스"],
  },
  {
    id: "merit",
    startFrame: sec(150),
    durationFrames: sec(5),
    badges: ["성성지구 생활권", "4억대 진입", "비규제 · 전매가능"],
  },
  {
    id: "outro",
    startFrame: sec(360),
    durationFrames: sec(18),
    badges: ["방문 상담 예약"],
  },
];

// ─── CTA 숨김 구간 (포인트타이틀/배너가 나올 때) ───
const ctaHideRanges = [
  // 배너, 포인트타이틀과 겹칠 때 숨김
  { start: sec(2), end: sec(8) },      // 배너: overview
  { start: sec(30), end: sec(35) },     // 포인트: 분양가
  { start: sec(65), end: sec(70) },     // 포인트: 붙박이장
  { start: sec(95), end: sec(101) },    // 배너: 타입별 가격
  { start: sec(130), end: sec(135) },   // 포인트: 거실 양창
  { start: sec(200), end: sec(206) },   // 배너: 비규제
  { start: sec(220), end: sec(225) },   // 포인트: 최저가
  { start: sec(310), end: sec(316) },   // 배너: 메리트
  { start: sec(330), end: sec(335) },   // 포인트: 계약금
  { start: sec(360), end: sec(379) },   // 아웃트로
];

export const HumanvilFirstCity: React.FC<HumanvilProps> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 원본 영상 (영상+오디오 포함) */}
      <OffthreadVideo
        src={staticFile("humanvil/source.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* 뱃지 오버레이 (좌상단) */}
      <BadgeOverlay configs={badges} />

      {/* CTA 전화번호 (우상단, 거의 상시 노출) */}
      <CtaOverlay
        phone="010-8282-8686"
        label="견본주택 관람 문의"
        showFrom={sec(4)}
        hideRanges={ctaHideRanges}
      />

      {/* 배너 띠 (상단/하단 슬라이드) */}
      <BannerOverlay banners={banners} />

      {/* 인포카드 (사이드 + 하단 혼합) */}
      <InfoCardOverlay cards={infoCards} />

      {/* 포인트 타이틀 (큰 모션 텍스트, 중간 강조) */}
      <PointTitleOverlay configs={pointTitles} />
    </AbsoluteFill>
  );
};
