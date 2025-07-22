import type { MeasuredDimensionsComponent, XImageData, XTextData, XViewData } from '../../types/types'
import { useTransitionStore } from '../stores/useTransitionStore'
import Animated from 'react-native-reanimated'
import { useTransitionLayout } from '../hooks/useTransitionLayout'
import { useTransitionBorderRadius } from '../hooks/useTransitionBorderRadius'
import { useTransitionFont } from '../hooks/useTransitionFont'
import { useTransitionProgress } from '../hooks/useTransitionProgress'

type TemporaryViewProps = Omit<Required<XViewData>, "type">
type TemporaryTextProps = Omit<XTextData, "type"> & Required<{ measure: MeasuredDimensionsComponent }>
type TemporaryImageProps = Omit<XImageData, "type"> & Required<{ measure: MeasuredDimensionsComponent }>



export const TemporaryView = ({ style, measure, tag }: TemporaryViewProps) => {
	const destinationData = useTransitionStore(
		(state) => state.destination?.xComponentsData.find((el) => el.tag === tag)
	)
	const {
		handlerTransitionLayout,
		animatedLayoutTransition
	} = useTransitionLayout(style, measure, destinationData)
	const { progress } = useTransitionProgress(tag, destinationData)
	const { animatedBorderRadius } = useTransitionBorderRadius(progress, style, destinationData)

	return (
		<Animated.View
			layout={handlerTransitionLayout}
			style={[
				animatedLayoutTransition,
				animatedBorderRadius
			]}
		/>
	)
}


export const TemporaryText = ({ style, measure, tag, text }: TemporaryTextProps) => {
	const destinationData = useTransitionStore(
		(state) => state.destination?.xComponentsData.find((el) => el.tag === tag)
	)
	const { handlerTransitionLayout, animatedLayoutTransition } = useTransitionLayout(
		style,
		measure,
		destinationData
	)
	const { progress } = useTransitionProgress(tag, destinationData)
	const { animatedBorderRadius } = useTransitionBorderRadius(progress, style, destinationData)
	const { animatedFont } = useTransitionFont(progress, style, destinationData)

	return (
		<Animated.Text
			layout={handlerTransitionLayout}
			style={[
				animatedLayoutTransition,
				animatedBorderRadius,
				animatedFont
			]}
		>
			{text ? text : ""}
		</Animated.Text>
	)
}


export const TemporaryImage = ({ style, measure, tag, source }: TemporaryImageProps) => {
	const destinationData = useTransitionStore(
		(state) => state.destination?.xComponentsData.find((el) => el.tag === tag)
	)
	const { handlerTransitionLayout, animatedLayoutTransition } = useTransitionLayout(
		style,
		measure,
		destinationData
	)
	const { progress } = useTransitionProgress(tag, destinationData)
	const { animatedBorderRadius } = useTransitionBorderRadius(progress, style, destinationData)


	return (
		<Animated.Image
			layout={handlerTransitionLayout}
			style={[
				animatedLayoutTransition,
				animatedBorderRadius,
			]}
			source={source}
		/>
	)
}