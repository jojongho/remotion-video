/**
 * AreaExplainerFace.tsx
 * "84㎡인데 왜 좁아 보이나요?" — Version 2 (얼굴 등장 버전)
 *
 * 구조:
 *   - 왼쪽 70%: AreaExplainer 인포그래픽 (재사용)
 *   - 오른쪽 30%: 조종호 소장 얼굴 영상 PiP
 *   - 전환: 타이틀/CTA 씬에서는 전체화면 전환
 *
 * 사용 방법:
 *   1. 조종호 소장 촬영본 (세로 or 가로) → public/footage/area-face.mp4
 *   2. npx remotion render AreaExplainerFace
 */

import React from 'react';
import {
  AbsoluteFill,
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { AreaExplainer } from './AreaExplainer';

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// PiP(Picture-in-Picture) 얼굴 영상 — 오른쪽 하단 고정
const FacePip: React.FC<{
  videoSrc: string;
  fromFrame: number;
  visible: boolean;
}> = ({ videoSrc, fromFrame, visible }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame - fromFrame,
    [0, 20],
    [0, visible ? 1 : 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: 40,
        bottom: 40,
        width: 340,
        height: 420,
        borderRadius: 20,
        overflow: 'hidden',
        border: '4px solid #2563EB',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        opacity,
        zIndex: 10,
      }}
    >
      <Video
        src={staticFile(videoSrc)}
        startFrom={fromFrame}  // 인포그래픽과 싱크
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* 이름 배지 */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(37,99,235,0.92)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          padding: '6px 14px',
          borderRadius: 20,
        }}
      >
        조종호 소장 | 아산·천안 분양 전문
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 메인 컴포지션
// ─────────────────────────────────────
export interface AreaExplainerFaceProps {
  faceSrc?: string;      // public/footage/ 내 파일명
  audioSrc?: string;
}

export const AreaExplainerFace: React.FC<AreaExplainerFaceProps> = ({
  faceSrc = 'footage/area-face.mp4',
  audioSrc = 'narration/area-explainer.mp3',
}) => {
  const frame = useCurrentFrame();

  // 타이틀(0~10s), CTA(145~150s) 구간에서는 PiP 숨김
  const showPip = frame >= s(10) && frame < s(145);

  return (
    <AbsoluteFill>
      {/* 베이스: AreaExplainer (인포그래픽) — 오디오 없이 */}
      <AreaExplainer audioSrc={undefined as any} />

      {/* 얼굴 PiP */}
      <FacePip
        videoSrc={faceSrc}
        fromFrame={s(10)}
        visible={showPip}
      />

      {/* 🔊 오디오 (Face 버전에서 붙임) */}
      {/* <Audio src={staticFile(audioSrc)} /> */}
    </AbsoluteFill>
  );
};
