import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface BannerItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface BannerConfig {
  id: string;
  startFrame: number;
  durationFrames: number;
  items: BannerItem[];
  position?: "bottom" | "top";
}

interface BannerOverlayProps {
  banners: BannerConfig[];
}

const BRAND = {
  dark: "#234454",
  mid: "#345866",
  light: "#eceff0",
};

const SingleBanner: React.FC<{
  banner: BannerConfig;
  localFrame: number;
}> = ({ banner, localFrame }) => {
  const { fps } = useVideoConfig();
  const fromBottom = (banner.position ?? "bottom") === "bottom";

  const enter = spring({
    fps,
    frame: localFrame,
    config: { damping: 16, stiffness: 80, mass: 0.8 },
  });

  const slideOffset = interpolate(enter, [0, 1], [fromBottom ? 280 : -280, 0]);

  const exitOpacity = interpolate(
    localFrame,
    [banner.durationFrames - 20, banner.durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(fromBottom ? { bottom: 0 } : { top: 0 }),
        transform: `translateY(${slideOffset}px)`,
        opacity: exitOpacity,
        width: 1920,
        height: 240,
        backgroundColor: BRAND.dark,
        display: "flex",
        alignItems: "center",
        padding: "0 80px",
        gap: 0,
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}
    >
      {banner.items.map((item, i) => {
        const itemEnter = spring({
          fps,
          frame: localFrame - 5 - i * 4,
          config: { damping: 14, stiffness: 100, mass: 0.5 },
        });
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                style={{
                  width: 2,
                  height: 100,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  flexShrink: 0,
                }}
              />
            )}
            <div
              style={{
                opacity: itemEnter,
                transform: `translateY(${interpolate(itemEnter, [0, 1], [20, 0])}px)`,
                flex: 1,
                padding: "0 48px",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: BRAND.light,
                  opacity: 0.7,
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 46,
                  fontWeight: 800,
                  color: item.highlight ? "#FFFFFF" : BRAND.light,
                  lineHeight: 1.2,
                }}
              >
                {item.value}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const BannerOverlay: React.FC<BannerOverlayProps> = ({ banners }) => {
  const frame = useCurrentFrame();

  const active = banners.find(
    (b) => frame >= b.startFrame && frame < b.startFrame + b.durationFrames
  );

  if (!active) return null;

  return (
    <AbsoluteFill>
      <SingleBanner banner={active} localFrame={frame - active.startFrame} />
    </AbsoluteFill>
  );
};
