import { StyleSheet, Text, View, type ViewProps } from 'react-native'
import type { XData, XTextData, XViewData } from '../../types/types'
import { useTransitionStore } from '../stores/useTransitionStore'
import { useTransitionProgress } from '../hooks/useTransitionProgress'
import Animated from 'react-native-reanimated'
import { useTransitionLayout } from '../hooks/useTransitionLayout'
import { useTransitionBorderRadius } from '../hooks/useTransitionBorderRadius'

type TemporaryViewProps = Omit<Required<XViewData>, "type">
type TemporaryTextProps = Omit<XTextData, "type">



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

	return (
		<Animated.Text
			layout={handlerTransitionLayout}
			style={[
				animatedLayoutTransition,
				animatedBorderRadius
			]}
		>
			{text ? text : ""}
		</Animated.Text>
	)
}