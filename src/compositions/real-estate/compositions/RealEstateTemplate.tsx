import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { MediaSlide } from '../components/MediaSlide';
import { TextLayout } from '../components/TextLayout';
import { InfoBox } from '../components/InfoBox';
import { HighlightCaption } from '../components/HighlightCaption';

// Define the Config Schema
export interface SceneConfig {
	id: string;
	durationInFrames: number;
	type: 'intro' | 'info' | 'outro' | string;
	media?: {
		type: 'image' | 'video' | 'color' | 'transparent';
		src?: string;
		value?: string;
	};
	text?: {
		main: string;
		sub?: string;
		style?: 'default' | 'highlight';
		segments?: { text: string; color?: string }[];
	};
	infoBox?: {
		title: string;
		value: string;
	};
}

export interface RealEstateConfig {
	meta: {
		title: string;
		fps: number;
		width: number;
		height: number;
	};
	theme: {
		primaryColor: string;
		secondaryColor: string;
		backgroundColor: string;
		fontFamily: string;
	};
	scenes: SceneConfig[];
}

export const RealEstateTemplate: React.FC<RealEstateConfig> = ({
	theme,
	scenes,
}) => {
	const { id } = useVideoConfig(); // use Video Configuration

	let accumulatedFrames = 0;

	return (
		<AbsoluteFill style={{ backgroundColor: theme.backgroundColor }}>
			{scenes.map((scene) => {
				const startFrame = accumulatedFrames;
				accumulatedFrames += scene.durationInFrames;

				return (
					<Sequence
						key={`${id}-${scene.id}`}
						from={startFrame}
						durationInFrames={scene.durationInFrames}
					>
						{/* 1. Background Media */}
						{scene.media && (
							<MediaSlide
								type={scene.media.type}
								src={scene.media.src || ''}
								colorValue={scene.media.value}
							/>
						)}

						{/* 2. Main Title and Captions */}
						{scene.text && scene.text.style === 'highlight' ? (
							<HighlightCaption 
								textLine={scene.text.segments || scene.text.main}
								fontSize={90} // Large punchy text
							/>
						) : (
							scene.text && (
								<TextLayout
									mainText={scene.text.main}
									subText={scene.text.sub}
									primaryColor={theme.primaryColor}
									secondaryColor={theme.secondaryColor}
									fontFamily={theme.fontFamily}
								/>
							)
						)}

						{/* 3. InfoBox for key stats */}
						{scene.infoBox && (
							<InfoBox
								title={scene.infoBox.title}
								value={scene.infoBox.value}
								primaryColor={theme.primaryColor}
							/>
						)}
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
