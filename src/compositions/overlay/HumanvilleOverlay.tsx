import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SidePanel } from "./components/SidePanel";
import { PointSubtitle } from "./components/PointSubtitle";
import { humanvilleData } from "./data/humanville";

type Props = {
  clipMode?: "panel" | "subtitle";
  clipId?: string;
  clipIndex?: number;
};

export const HumanvilleOverlay: React.FC<Props> = ({
  clipMode,
  clipId,
  clipIndex,
}) => {
  const fps = 30;

  // 개별 패널 모드
  if (clipMode === "panel" && clipId) {
    const panel = humanvilleData.사이드패널.find((p) => p.id === clipId);
    if (!panel) return null;
    return (
      <AbsoluteFill>
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
      </AbsoluteFill>
    );
  }

  // 개별 자막 모드
  if (clipMode === "subtitle" && clipIndex !== undefined) {
    const sub = humanvilleData.포인트자막[clipIndex];
    if (!sub) return null;
    return (
      <AbsoluteFill>
        <PointSubtitle
          text={sub.text}
          style={sub.style}
          enterFrame={0}
          exitFrame={sub.dur * fps}
          position={sub.style === "subtitle" ? "bottom" : "top"}
        />
      </AbsoluteFill>
    );
  }

  // 전체 모드 (기존)
  return (
    <AbsoluteFill>
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
