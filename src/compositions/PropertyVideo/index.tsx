import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  staticFile,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
  spring,
  useDelayRender,
} from 'remotion';
import { parseSrt, createTikTokStyleCaptions } from '@remotion/captions';
import type { Caption } from '@remotion/captions';
import { SpaceEntrySubtitle } from '../../components/KoreanSubtitles';

const SpecOverlay: React.FC<{ specs: string[] }> = ({ specs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px',
        color: 'white',
      }}
    >
      <div style={{ fontSize: 80, fontWeight: 900, marginBottom: 40, color: '#FFF500' }}>
        주택 정보
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {specs.map((spec, i) => {
          const progress = spring({
            fps,
            frame,
            delay: i * 5,
            config: { damping: 15 },
          });
          return (
            <div
              key={i}
              style={{
                fontSize: 50,
                fontWeight: 600,
                opacity: progress,
                transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
              }}
            >
              • {spec}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SummaryOverlay: React.FC<{ summary: string[] }> = ({ summary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        opacity: progress,
      }}
    >
      <div style={{ fontSize: 70, fontWeight: 900, marginBottom: 60 }}>
        입지 및 교통 정보
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
        {summary.map((item, i) => (
          <div key={i} style={{ fontSize: 45, fontWeight: 500 }}>
            {item}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 100, fontSize: 60, fontWeight: 800, color: '#FFF500' }}>
        문의: 010-XXXX-XXXX
      </div>
    </AbsoluteFill>
  );
};

const CaptionPlayer: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps, durationInFrames } = useVideoConfig();

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: 1000,
    });
  }, [captions]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = nextPage 
          ? (nextPage.startMs / 1000) * fps 
          : durationInFrames;
        const duration = Math.max(1, Math.round(endFrame - startFrame));

        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: '75%' }}>
              <div
                style={{
                  fontSize: 54,
                  fontWeight: 800,
                  color: 'white',
                  textAlign: 'center',
                  padding: '10px 40px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: '12px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  whiteSpace: 'pre-wrap',
                  width: '80%',
                }}
              >
                {page.text}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const PropertyVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile('srt_dir/시퀀스_10.srt'));
      const text = await response.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      console.error(e);
      cancelRender(e);
    }
  }, [handle, continueRender, cancelRender]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const specs = [
    '토지: 약 150평 (496㎡)',
    '연면적: 약 85평 (279.92㎡)',
    '구조: 철근콘크리트 3층 단독주택',
    '매매가: 4억 9,000만원',
    '특징: 남향, 단독 정원 및 테라스',
  ];

  const spaces = [
    { start: 1 * 60 + 15, duration: 2 * 60, title: '외부 및 정원', subtitle: '단독 정원과 야외 테라스' },
    { start: 2 * 60 + 30, duration: 2 * 60 + 30, title: '1층 생활 공간', subtitle: '거실, 주방, 게스트룸' },
    { start: 5 * 60, duration: 1 * 60 + 30, title: '2층 주거 공간', subtitle: '가족실, 안방, 드레스룸' },
    { start: 6 * 60 + 30, duration: 1 * 60 + 30, title: '3층 다락 및 테라스', subtitle: '다락방과 넓은 야외 공간' },
  ];

  const summary = [
    '천안시청 15분',
    'KTX 천안아산역 20분',
    '음봉 IC 5분',
    '국도 43호선 인접 (교통 편리)',
  ];

  if (!captions) {
    return null;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Video
        src={staticFile('video_dir/20260406_133149.mp4')}
        // eslint-disable-next-line @remotion/no-object-fit-on-media-video
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Intro Spec Overlay (0:00 to 0:45) */}
      <Sequence durationInFrames={fps * 45}>
        <SpecOverlay specs={specs} />
      </Sequence>

      {/* Space Titles */}
      {spaces.map((space, i) => (
        <Sequence key={i} from={space.start * fps} durationInFrames={space.duration * fps}>
          <SpaceEntrySubtitle title={space.title} subtitle={space.subtitle} />
        </Sequence>
      ))}

      {/* SRT Captions */}
      <CaptionPlayer captions={captions} />

      {/* Outro Summary Overlay (8:00 to end) */}
      <Sequence from={8 * 60 * fps}>
        <SummaryOverlay summary={summary} />
      </Sequence>

      {/* Title Watermark */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 60,
          color: 'white',
          fontSize: 36,
          fontWeight: 800,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '10px 20px',
          borderRadius: '8px',
        }}
      >
        음봉면 신정리 150-4 단독주택
      </div>
    </AbsoluteFill>
  );
};
