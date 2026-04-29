/**
 * ExplainerOverlay.tsx
 * 설명 오버레이 컴포넌트 모음
 * AreaExplainer.tsx의 각 씬에 import해서 사용
 *
 * 사용 패턴:
 *   <Sequence from={...}>
 *     <AreaScene ... />
 *     <ExplainerOverlay cues={SCENE_CUES.jeon} localFrame={localFrame(T.jeon.from)} />
 *   </Sequence>
 */

import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

// ─────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────
export interface OverlayCue {
  /** 씬 내 등장 시작 (초) */
  at: number;
  /** 표시 지속 시간 (초) */
  duration: number;
  /** 텍스트 내용 */
  text: string;
  /** 강조 키워드 (볼드·컬러) */
  highlight?: string;
  /** 오버레이 스타일 */
  style?: "callout" | "subtitle" | "tip" | "warning";
  /** 화면 위치 */
  position?: "bottom" | "top" | "center" | "bottom-left";
  /** 컬러 오버라이드 */
  color?: string;
}

// ─────────────────────────────────────
// 씬별 큐 정의 (나레이션 타이밍에 맞게 조정)
// ─────────────────────────────────────
export const OVERLAY_CUES: Record<string, OverlayCue[]> = {
  /** 씬 2: 훅 */
  hook: [
    {
      at: 2,
      duration: 5,
      text: "광고: 84㎡",
      highlight: "84㎡",
      style: "warning",
      position: "top",
    },
    {
      at: 8,
      duration: 6,
      text: "실제 내 공간: 59㎡",
      highlight: "59㎡",
      style: "callout",
      position: "center",
    },
    {
      at: 12,
      duration: 5,
      text: "25㎡ 차이 = 방 1개 크기",
      highlight: "25㎡",
      style: "tip",
      position: "bottom",
    },
  ],

  /** 씬 3: 전용면적 */
  jeon: [
    {
      at: 2,
      duration: 6,
      text: "전용면적 = 내가 독점 사용하는 공간",
      highlight: "독점",
      style: "subtitle",
      position: "bottom",
    },
    {
      at: 9,
      duration: 6,
      text: "벽 두께·복도 제외",
      highlight: "제외",
      style: "tip",
      position: "bottom",
    },
    {
      at: 17,
      duration: 8,
      text: "청약·관리비·세금 모두 전용 기준 적용",
      highlight: "전용 기준",
      style: "callout",
      position: "bottom",
    },
    {
      at: 25,
      duration: 5,
      text: '💡 모델하우스에서 "전용 몇 ㎡인가요?" 먼저 질문',
      style: "tip",
      position: "bottom",
    },
  ],

  /** 씬 4: 공급면적 */
  gong: [
    {
      at: 2,
      duration: 6,
      text: "공급면적 = 전용 + 주거 공용 (같은 층)",
      highlight: "같은 층",
      style: "subtitle",
      position: "bottom",
    },
    {
      at: 9,
      duration: 6,
      text: '분양 광고에 나오는 "84㎡"가 여기',
      highlight: "분양 광고",
      style: "warning",
      position: "bottom",
    },
    {
      at: 17,
      duration: 8,
      text: "청약 신청·세대 구분도 공급면적 기준",
      highlight: "청약 신청",
      style: "tip",
      position: "bottom",
    },
    {
      at: 25,
      duration: 5,
      text: "⚠️ 공급 = 전용이 아님. 25㎡ 차이",
      style: "warning",
      position: "bottom",
    },
  ],

  /** 씬 5: 계약면적 */
  gyeyak: [
    {
      at: 2,
      duration: 6,
      text: "계약면적 = 공급 + 기타 공용",
      highlight: "기타 공용",
      style: "subtitle",
      position: "bottom",
    },
    {
      at: 9,
      duration: 6,
      text: "지하주차장·관리사무소 등 단지 전체 포함",
      highlight: "단지 전체",
      style: "tip",
      position: "bottom",
    },
    {
      at: 17,
      duration: 8,
      text: "계약서에 이 숫자가 기재됨",
      highlight: "계약서",
      style: "callout",
      position: "bottom",
    },
    {
      at: 25,
      duration: 5,
      text: "실제 내 공간(59) vs 계약 숫자(105) 차이",
      style: "warning",
      position: "bottom",
    },
  ],

  /** 씬 6: 비교표 */
  compare: [
    {
      at: 2,
      duration: 6,
      text: "전용 < 공급 < 계약 순으로 커집니다",
      style: "subtitle",
      position: "bottom",
    },
    {
      at: 10,
      duration: 8,
      text: "💡 같은 단지라도 타입별로 전용 비율이 다를 수 있어요",
      style: "tip",
      position: "bottom",
    },
  ],

  /** 씬 7: 핵심 팁 */
  tip: [
    {
      at: 1,
      duration: 8,
      text: "전용면적 비율 = 전용 ÷ 공급 × 100 (높을수록 좋음)",
      highlight: "전용면적 비율",
      style: "callout",
      position: "bottom",
    },
  ],
};

// ─────────────────────────────────────
// 단일 오버레이 큐 렌더링
// ─────────────────────────────────────
const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

const CueItem: React.FC<{ cue: OverlayCue; localFrame: number }> = ({
  cue,
  localFrame,
}) => {
  const start = s(cue.at);
  const end = start + s(cue.duration);

  const opacity = interpolate(
    localFrame,
    [start, start + 8, end - 6, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (opacity <= 0) return null;

  const slideY = interpolate(localFrame, [start, start + 12], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const STYLES: Record<string, React.CSSProperties> = {
    subtitle: {
      background: "rgba(0,0,0,0.78)",
      color: "#FFFFFF",
      fontSize: 28,
      padding: "14px 36px",
      borderRadius: 8,
      maxWidth: 1200,
      textAlign: "center",
    },
    callout: {
      background: "#EFF6FF",
      color: "#1D4ED8",
      fontSize: 26,
      padding: "16px 36px",
      borderRadius: 12,
      border: "2px solid #3B82F6",
      maxWidth: 1000,
      fontWeight: 700,
      textAlign: "center",
    },
    tip: {
      background: "#F0FDF4",
      color: "#16A34A",
      fontSize: 24,
      padding: "14px 32px",
      borderRadius: 12,
      border: "2px solid #86EFAC",
      maxWidth: 1100,
      fontWeight: 600,
      textAlign: "center",
    },
    warning: {
      background: "#FFF7ED",
      color: "#C2410C",
      fontSize: 26,
      padding: "14px 32px",
      borderRadius: 12,
      border: "2px solid #FB923C",
      maxWidth: 900,
      fontWeight: 700,
      textAlign: "center",
    },
  };

  const POSITIONS: Record<string, React.CSSProperties> = {
    bottom: {
      bottom: 60,
      left: "50%",
      transform: `translateX(-50%) translateY(${slideY}px)`,
    },
    top: {
      top: 60,
      left: "50%",
      transform: `translateX(-50%) translateY(${-slideY}px)`,
    },
    center: { top: "50%", left: "50%", transform: `translate(-50%, -50%)` },
    "bottom-left": { bottom: 60, left: 60 },
  };

  const boxStyle = STYLES[cue.style || "subtitle"];
  const posStyle = POSITIONS[cue.position || "bottom"];

  // 하이라이트 키워드 처리
  const renderText = () => {
    if (!cue.highlight) return cue.text;
    const parts = cue.text.split(cue.highlight);
    return parts.map((part, i) => (
      <React.Fragment key={i}>
        {part}
        {i < parts.length - 1 && (
          <span style={{ color: cue.color || "#F59E0B", fontWeight: 900 }}>
            {cue.highlight}
          </span>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div
      style={{
        position: "absolute",
        opacity,
        zIndex: 20,
        ...boxStyle,
        ...posStyle,
      }}
    >
      {renderText()}
    </div>
  );
};

// ─────────────────────────────────────
// 씬에 붙이는 오버레이 컴포넌트
// ─────────────────────────────────────
export const ExplainerOverlay: React.FC<{
  cues: OverlayCue[];
  localFrame: number;
}> = ({ cues, localFrame }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {cues.map((cue, i) => (
        <CueItem key={i} cue={cue} localFrame={localFrame} />
      ))}
    </AbsoluteFill>
  );
};
