import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MediaSlideProps {
	src: string;
	type: 'image' | 'video' | 'color' | 'transparent';
	colorValue?: string; // Used if type is color
}

export const MediaSlide: React.FC<MediaSlideProps> = ({ src, type, colorValue }) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// Subtle Ken Burns zoom effect
	const scale = interpolate(
		frame,
		[0, durationInFrames],
		[1, 1.1],
		{ extrapolateRight: 'clamp' }
	);

	if (type === 'color' && colorValue) {
		return (
			<AbsoluteFill style={{ backgroundColor: colorValue }} />
		);
	}
	
	if (type === 'transparent') {
		return (
			<AbsoluteFill style={{ backgroundColor: 'transparent' }} />
		);
	}

	if (type === 'image') {
		return (
			<AbsoluteFill style={{ overflow: 'hidden' }}>
				<Img
					src={src}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${scale})`,
						transformOrigin: 'center center',
					}}
				/>
				{/* Dark overlay for better text readability */}
				<AbsoluteFill style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />
			</AbsoluteFill>
		);
	}

	return null; // Implement video fallback later if needed
};
