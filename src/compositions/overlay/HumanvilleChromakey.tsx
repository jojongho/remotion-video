import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SidePanel } from "./components/SidePanel";
import { PointSubtitle } from "./components/PointSubtitle";
import { humanvilleData } from "./data/humanville";

// 크로마키 버전 — 초록 배경 (#00FF00)으로 필모라에서 크로마키 제거
export const HumanvilleChromakey: React.FC = () => {
  const fps = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: "#00FF00" }}>
      {/* 사이드 패널 */}
      {humanvilleData.사이드패널.map((panel) => {
        const enterFrame = panel.start * fps;

        return (
          <Sequence key={panel.id} from={enterFrame} durationInFrames={panel.dur * fps}>
            <SidePanel
              side={panel.side}
              title={panel.title}
              subtitle={"subtitle" in panel ? (panel as any).subtitle : undefined}
              tags={"tags" in panel ? (panel as any).tags : undefined}
              items={"items" in panel ? (panel as any).items : undefined}
              bigPrice={"bigPrice" in panel ? (panel as any).bigPrice : undefined}
              bullets={"bullets" in panel ? (panel as any).bullets : undefined}
              checklist={"checklist" in panel ? (panel as any).checklist : undefined}
              footer={"footer" in panel ? (panel as any).footer : undefined}
              enterFrame={0}
              exitFrame={panel.dur * fps}
            />
          </Sequence>
        );
      })}

      {/* 포인트 자막 */}
      {humanvilleData.포인트자막.map((sub, i) => {
        const enterFrame = sub.start * fps;
        return (
          <Sequence key={`sub-${i}`} from={enterFrame} durationInFrames={sub.dur * fps}>
            <PointSubtitle
              text={sub.text}
              style={sub.style}
              enterFrame={0}
              exitFrame={sub.dur * fps}
              position={sub.style === "subtitle" ? "bottom" : "top"}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
