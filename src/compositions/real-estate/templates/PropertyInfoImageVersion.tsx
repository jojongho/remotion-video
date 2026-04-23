/**
 * 🏢 사업개요 템플릿 - Version A
 * 좌측: 아파트 투시도(이미지)
 * 우측: 사업 상세 정보 (항목별 순차 애니메이션)
 *
 * 사용법:
 *   <PropertyInfoImageVersion
 *     imageSrc={staticFile("apartment.jpg")}
 *     title="탕정 동일하이빌 파크레인"
 *     logoSrc={staticFile("logo.png")}
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
  Img,
} from "remotion";
import { TOKENS } from "../styles/presets";

// ============================================================
// 타입 정의
// ============================================================

export interface InfoItem {
  label: string;
  value: string;
}

interface PropertyInfoImageVersionProps {
  /** 좌측 이미지 경로 (staticFile 사용) */
  imageSrc: string;
  /** 프로젝트명 (좌상단) */
  title: string;
  /** 로고 이미지 경로 (우상단, 선택) */
  logoSrc?: string;
  /** 브랜드 이름 (우상단, 선택) */
  brandName?: string;
  /** 섹션 타이틀 (좌상단 "사업개요" 등) */
  sectionLabel?: string;
  /** 정보 항목 배열 */
  items: InfoItem[];
  /** 강조 컬러 (기본: 네이비) */
  accentColor?: string;
}

// ============================================================
// 컴포넌트
// ============================================================

export const PropertyInfoImageVersion: React.FC<
  PropertyInfoImageVersionProps
> = ({
  imageSrc,
  title,
  logoSrc,
  brandName,
  sectionLabel = "사업개요",
  items,
  accentColor = "#2C3E6B",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 전체 컨테이너 페이드인
  const containerOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 이미지 슬라이드인 (왼쪽에서)
  const imageTranslateX = interpolate(frame, [0.2 * fps, 1 * fps], [-60, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const imageOpacity = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 타이틀 애니메이션
  const titleOpacity = interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        opacity: containerOpacity,
        fontFamily: TOKENS.fonts.primary,
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "40px 60px 20px 60px",
          opacity: titleOpacity,
        }}
      >
        {/* 섹션 라벨 */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: accentColor,
            borderBottom: `3px solid ${accentColor}`,
            paddingBottom: 8,
          }}
        >
          {sectionLabel}
        </div>

        {/* 브랜드/로고 */}
        {(brandName || logoSrc) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {brandName && (
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: accentColor,
                }}
              >
                {brandName}
              </span>
            )}
            {logoSrc && (
              <Img
                src={logoSrc}
                style={{ height: 40, objectFit: "contain" }}
              />
            )}
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "20px 60px 40px 60px",
          gap: 60,
        }}
      >
        {/* 좌측: 이미지 */}
        <div
          style={{
            flex: 5,
            display: "flex",
            flexDirection: "column",
            transform: `translateX(${imageTranslateX}px)`,
            opacity: imageOpacity,
          }}
        >
          {/* 프로젝트명 */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#333",
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* 투시도 이미지 */}
          <div
            style={{
              flex: 1,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            }}
          >
            <Img
              src={imageSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* 우측: 정보 리스트 */}
        <div
          style={{
            flex: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {items.map((item, index) => {
            // 각 항목 순차 등장 (0.5초 간격)
            const itemDelay = (0.6 + index * 0.3) * fps;
            const itemOpacity = interpolate(
              frame,
              [itemDelay, itemDelay + 0.4 * fps],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );
            const itemTranslateY = interpolate(
              frame,
              [itemDelay, itemDelay + 0.4 * fps],
              [20, 0],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );

            return (
              <div
                key={index}
                style={{
                  opacity: itemOpacity,
                  transform: `translateY(${itemTranslateY}px)`,
                  borderBottom:
                    index < items.length - 1
                      ? "1px solid #E8E8E8"
                      : "none",
                  padding: "20px 0",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#333",
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: "#666",
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

export default PropertyInfoImageVersion;
