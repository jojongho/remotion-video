import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextSegment {
	text: string;
	color?: string; // Default to white if not provided
}

export interface HighlightCaptionProps {
	textLine: string | TextSegment[];
	strokeColor?: string; // Default to black
	baseColor?: string; // Default to white
	fontFamily?: string;
	fontSize?: number; // Default to 120
}

export const HighlightCaption: React.FC<HighlightCaptionProps> = ({
	textLine,
	strokeColor = '#000000',
	baseColor = '#FFFFFF',
	fontFamily = 'system-ui, "Apple SD Gothic Neo", sans-serif',
	fontSize = 120,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Very fast, punchy spring animation for emphasis
	const scale = spring({
		fps,
		frame,
		config: {
			damping: 10,
			stiffness: 150,
			mass: 0.5,
		},
	});

	// Normalize input to segments
	const segments: TextSegment[] =
		typeof textLine === 'string'
			? [{ text: textLine, color: baseColor }]
			: textLine;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '100px', // Bottom aligned like in the images
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					fontFamily,
					fontSize: `${fontSize}px`,
					fontWeight: '900', // Extra bold
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '20px',
					// Multiple text shadows to simulate a thick, hard outline (stroke)
					textShadow: `
                        -4px -4px 0 ${strokeColor},  
                         4px -4px 0 ${strokeColor},
                        -4px  4px 0 ${strokeColor},
                         4px  4px 0 ${strokeColor},
                        -6px  0px 0 ${strokeColor},
                         6px  0px 0 ${strokeColor},
                         0px -6px 0 ${strokeColor},
                         0px  6px 0 ${strokeColor},
                         0px 15px 20px rgba(0,0,0,0.5)
                    `,
					WebkitTextStroke: `2px ${strokeColor}`, // Additional Webkit stroke for sharpness
				}}
			>
				{segments.map((segment, index) => (
					<span
						key={index}
						style={{
							color: segment.color || baseColor,
						}}
					>
						{segment.text}
					</span>
				))}
			</div>
		</AbsoluteFill>
	);
};
