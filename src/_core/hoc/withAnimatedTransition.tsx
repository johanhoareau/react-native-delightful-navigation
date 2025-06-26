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

type ComponentWithAnimatedTransitionProps<T> = T &
	AdditionnalXComponentData & { tag: TransitionTag }

function withAnimatedTransition<T extends object>(
	WrappedComponent: React.ComponentType<T>
) {
	const ComponentWithAnimatedTransition = (
		props: ComponentWithAnimatedTransitionProps<T>
	) => {
		const { tag, measure, style } = props

		const destinationData = useTransitionStore((state) =>
			state.destination?.xComponentsData.find((el) => el.tag === tag)
		)
		const setTransitionComponentIsFinished = useTransitionStore(state => state.setTransitionComponentIsFinished)

		const progress = useSharedValue(0)
		const scaleX = useSharedValue(1)
		const scaleY = useSharedValue(1)
		const xTranslation = useSharedValue(0)
		const yTranslation = useSharedValue(0)
		const borderRadius = useSharedValue(style.borderRadius)
		const opacity = useSharedValue(style.opacity)

		useEffect(() => {
			if (destinationData) {
				progress.value = withDelay(100, withTiming(1, { duration: 300 }, (finished) => {
					if (finished) runOnJS(setTransitionComponentIsFinished)(tag)
				}))
			}
		}, [destinationData])

		const animatedTransitionStyle = useAnimatedStyle(() => {
			let scaleXEnd = 1
			let scaleYEnd = 1
			let diffX = 0
			let diffY = 0
			if (destinationData?.measure) {
				diffX = destinationData.measure.x - measure.x
				diffY = destinationData.measure.y - measure.y
				scaleXEnd = destinationData.measure.width / measure.width
				scaleYEnd = destinationData.measure.height / measure.height
			}
			const borderRadiusStart = style?.borderRadius ? style.borderRadius : 0
			let borderRadiusEnd = destinationData?.style?.borderRadius
				? destinationData?.style.borderRadius
				: 0
			if (scaleXEnd !== 1) {
				borderRadiusEnd = borderRadiusEnd / scaleXEnd
			}
			// const opacityStart = style?.opacity !== 0 ? style.opacity : 1
			// const opacityEnd = destinationData?.style?.opacity !== 0 ? destinationData?.style?.opacity : 1
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



			scaleX.value = interpolate(
				progress.value,
				[0, 1],
				[1, scaleXEnd]
			)
			scaleY.value = interpolate(
				progress.value,
				[0, 1],
				[1, scaleYEnd]
			)

			if (diffX) {
				xTranslation.value = interpolate(
					progress.value,
					[0, 1],
					[0, diffX]
				)
			}
			if (diffY) {
				yTranslation.value = interpolate(
					progress.value,
					[0, 1],
					[0, diffY]
				)
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
					{ translateX: xTranslation.value },
					{ translateY: yTranslation.value },
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
