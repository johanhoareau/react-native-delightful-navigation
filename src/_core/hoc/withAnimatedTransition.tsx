import {
	interpolate,
	runOnJS,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated"
import type {
	AdditionnalXComponentData,
	TransitionTag,
} from "../../types/types"
import { useTransitionStore } from "../stores/useTransitionStore"
import { useEffect } from "react"
import { useTransitionScale } from "../hooks/useTransitionScale"
import { useTransitionTranslate } from "../hooks/useTransitionTranslate"

type ComponentWithAnimatedTransitionProps<T> = T &
	AdditionnalXComponentData & { tag: TransitionTag }

function withAnimatedTransition<T extends object>(
	WrappedComponent: React.ComponentType<T>
) {
	const ComponentWithAnimatedTransition = (
		props: ComponentWithAnimatedTransitionProps<T>
	) => {
		const { tag, measure, style } = props

		const destinationData = useTransitionStore((state) => state.destination?.xComponentsData.find((el) => el.tag === tag))
		const setTransitionComponentIsFinished = useTransitionStore(state => state.setTransitionComponentIsFinished)

		const progress = useSharedValue(0)
		const { scaleX, scaleY } = useTransitionScale(progress, measure, destinationData)
		const { translateX, translateY } = useTransitionTranslate(progress, measure, destinationData)
		const borderRadius = useSharedValue(style.borderRadius)
		const opacity = useSharedValue(style.opacity)

		useEffect(() => {
			if (destinationData && !destinationData.isTransitionFinished) {
				progress.value = withTiming(1, { duration: 300 }, (finished) => {
					if (finished) runOnJS(setTransitionComponentIsFinished)(tag)
				})
			}
		}, [destinationData])

		const animatedTransitionStyle = useAnimatedStyle(() => {
			const borderRadiusStart = style?.borderRadius ? style.borderRadius : 0
			let borderRadiusEnd = destinationData?.style?.borderRadius
				? destinationData?.style.borderRadius
				: 0
			// if (scaleXEnd !== 1) {
			// 	borderRadiusEnd = borderRadiusEnd / scaleXEnd
			// }
			let opacityStart
			let opacityEnd
			if (style.opacity === 0 || style.opacity) {
				opacityStart = style.opacity
			} else {
				opacityStart = 1
			}
			if (destinationData?.style.opacity === 0 || destinationData?.style.opacity) {
				opacityEnd = destinationData.style.opacity
			} else {
				opacityEnd = 1
			}

			borderRadius.value = interpolate(
				progress.value,
				[0, 1],
				[borderRadiusStart, borderRadiusEnd]
			)
			opacity.value = interpolate(
				progress.value,
				[0, 1],
				[opacityStart, opacityEnd]
			)

			return {
				transform: [
					{ translateX: translateX.value },
					{ translateY: translateY.value },
					{ scaleX: scaleX.value },
					{ scaleY: scaleY.value },
				],
				borderRadius: borderRadius.value,
				opacity: opacity.value
			}
		})

		return (
			<>
				<WrappedComponent
					style={[
						style,
						{
							position: 'absolute',
							transformOrigin: "left top",
							height: measure.height,
							width: measure.width,
							margin: 0,
							padding: 0,
							left: measure.x,
							top: measure.y,
							// backgroundColor: 'green'
						},
						animatedTransitionStyle,
					]}
				// {...(restProps as T)}
				/>
			</>
		)
	}
	return ComponentWithAnimatedTransition
}

export default withAnimatedTransition
