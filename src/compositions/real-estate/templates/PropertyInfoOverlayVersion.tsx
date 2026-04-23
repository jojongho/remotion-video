/**
 * 🏢 사업개요 템플릿 - Version B
 * 배경: 영상 또는 단색 (투명 오버레이 시 영상은 프리미어에서 처리)
 * 반투명 검정 배경이 먼저 페이드인 → 텍스트 내용이 순차 애니메이션
 *
 * ✅ 투명 배경 WebM 렌더링 시, 반투명 검정 오버레이만 포함
 *    → 프리미어에서 영상 위에 올리면 자연스럽게 합성
 *
 * 사용법:
 *   <PropertyInfoOverlayVersion
 *     title="탕정 동일하이빌 파크레인"
 *     items={[
 *       { label: "대지위치", value: "충남 아산시 탕정면" },
 *       { label: "세대수", value: "총 1,234세대" },
 *       ...
 *     ]}
 *   />
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { TOKENS } from "../styles/presets";

// ============================================================
// 타입 정의
// ============================================================

export interface InfoItem {
  label: string;
  value: string;
}

interface PropertyInfoOverlayVersionProps {
  /** 프로젝트명 (상단 타이틀) */
  title: string;
  /** 섹션 라벨 (기본: "사업개요") */
  sectionLabel?: string;
  /** 정보 항목 배열 */
  items: InfoItem[];
  /** 오버레이 불투명도 (0~1, 기본: 0.75) */
  overlayOpacity?: number;
  /** 레이아웃 (기본: "center", "left", "right") */
  layout?: "center" | "left" | "right";
  /** 강조 컬러 */
  accentColor?: string;
}

// ============================================================
// 컴포넌트
// ============================================================

export const PropertyInfoOverlayVersion: React.FC<
  PropertyInfoOverlayVersionProps
> = ({
  title,
  sectionLabel = "사업개요",
  items,
  overlayOpacity = 0.75,
  layout = "center",
  accentColor = "#FFD700",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── 1단계: 반투명 검정 배경 페이드인 (0 ~ 1초) ───
  const bgOpacity = interpolate(
    frame,
    [0, 1 * fps],
    [0, overlayOpacity],
    { extrapolateRight: "clamp" }
  );

  // ─── 2단계: 타이틀 페이드인 (0.8초 ~ 1.5초) ───
  const titleOpacity = interpolate(
    frame,
    [0.8 * fps, 1.5 * fps],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const titleTranslateY = interpolate(
    frame,
    [0.8 * fps, 1.5 * fps],
    [30, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // ─── 3단계: 구분선 확장 (1.2초 ~ 1.8초) ───
  const dividerWidth = interpolate(
    frame,
    [1.2 * fps, 1.8 * fps],
    [0, 120],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // 레이아웃별 정렬
  const alignItems =
    layout === "left"
      ? "flex-start"
      : layout === "right"
      ? "flex-end"
      : "center";
  const textAlign =
    layout === "left" ? "left" : layout === "right" ? "right" : "center";
  const paddingHorizontal = layout === "center" ? 200 : 80;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* 반투명 검정 배경 (페이드인) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
        }}
      />

      {/* 콘텐츠 영역 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems,
          padding: `60px ${paddingHorizontal}px`,
          fontFamily: TOKENS.fonts.primary,
        }}
      >
        {/* 섹션 라벨 */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            fontSize: 20,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            marginBottom: 16,
            textAlign: textAlign as any,
          }}
        >
          {sectionLabel}
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            fontSize: 52,
            fontWeight: 700,
            color: "#FFFFFF",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            marginBottom: 20,
            textAlign: textAlign as any,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: dividerWidth,
            height: 2,
            backgroundColor: accentColor,
            marginBottom: 32,
            alignSelf:
              layout === "right"
                ? "flex-end"
                : layout === "left"
                ? "flex-start"
                : "center",
          }}
        />

        {/* 정보 항목 그리드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            width: layout === "center" ? 700 : 600,
          }}
        >
          {items.map((item, index) => {
            // 각 항목 순차 등장 (1.5초부터 0.25초 간격)
            const itemDelay = (1.5 + index * 0.25) * fps;
            const itemOpacity = interpolate(
              frame,
              [itemDelay, itemDelay + 0.4 * fps],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );
            const itemTranslateX = interpolate(
              frame,
              [itemDelay, itemDelay + 0.4 * fps],
              [layout === "right" ? 30 : -30, 0],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );

            return (
              <div
                key={index}
                style={{
                  opacity: itemOpacity,
                  transform: `translateX(${itemTranslateX}px)`,
                  display: "flex",
                  alignItems: "baseline",
                  padding: "16px 0",
                  borderBottom:
                    index < items.length - 1
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "none",
                }}
              >
                {/* 라벨 */}
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    minWidth: 140,
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </div>

                {/* 값 */}
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoOverlayVersion;
