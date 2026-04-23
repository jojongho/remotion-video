import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface InfoBoxProps {
	title: string;
	value: string;
	primaryColor?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
	title,
	value,
	primaryColor = '#FF3366',
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Spring animation for popping in
	const scale = spring({
		fps,
		frame: frame - 20, // Delay the box appearance slightly
		config: {
			damping: 12,
			mass: 0.8,
			stiffness: 100,
		},
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '200px', // Position above captions
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					backgroundColor: 'white',
					borderRadius: '20px',
					padding: '20px 40px',
					boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					borderTop: `10px solid ${primaryColor}`,
				}}
			>
				<span
					style={{
						color: '#666',
						fontSize: '24px',
						fontWeight: 'bold',
						marginBottom: '10px',
						textTransform: 'uppercase',
					}}
				>
					{title}
				</span>
				<span
					style={{
						color: '#111',
						fontSize: '48px',
						fontWeight: '900',
					}}
				>
					{value}
				</span>
			</div>
		</AbsoluteFill>
	);
};
