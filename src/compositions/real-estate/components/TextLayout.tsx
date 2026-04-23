import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface TextLayoutProps {
	mainText: string;
	subText?: string;
	primaryColor?: string;
	secondaryColor?: string;
	fontFamily?: string;
}

export const TextLayout: React.FC<TextLayoutProps> = ({
	mainText,
	subText,
	primaryColor = '#0055FF',
	secondaryColor = '#ffffff',
	fontFamily = 'system-ui, sans-serif',
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Animate the main text popping in
	const scale = spring({
		fps,
		frame,
		config: {
			mass: 0.5,
		},
	});

	// Animate subtext fading and sliding up
	const opacity = interpolate(frame, [15, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const translateY = interpolate(frame, [15, 30], [50, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily,
				padding: '40px',
				textAlign: 'center',
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					fontSize: '80px',
					fontWeight: 'bold',
					color: secondaryColor,
					textShadow: `0 0 20px ${primaryColor}, 0 4px 10px rgba(0,0,0,0.5)`,
					marginBottom: '20px',
					lineHeight: 1.1,
				}}
			>
				{mainText}
			</div>

			{subText && (
				<div
					style={{
						opacity,
						transform: `translateY(${translateY}px)`,
						fontSize: '40px',
						fontWeight: '500',
						color: '#dddddd',
						backgroundColor: 'rgba(0,0,0,0.6)',
						padding: '10px 30px',
						borderRadius: '20px',
					}}
				>
					{subText}
				</div>
			)}
		</AbsoluteFill>
	);
};
