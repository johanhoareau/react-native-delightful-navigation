import {
	Easing,
	interpolate,
	LinearTransition,
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

const TRANSITION_DURATION = 500
const TRANSITION_EASING = Easing.inOut(Easing.quad)

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
		const borderRadius = useSharedValue(style.borderRadius)

		useEffect(() => {
			if (destinationData && !destinationData.isTransitionFinished) {
				progress.value = withTiming(1,
					{
						duration: TRANSITION_DURATION,
						easing: TRANSITION_EASING
					},
					(finished) => {
						if (finished) runOnJS(setTransitionComponentIsFinished)(tag)
					})
			}
		}, [destinationData])

		const animatedTransitionStyle = useAnimatedStyle(() => {
			const borderRadiusStart = style?.borderRadius ? style.borderRadius : 0
			let borderRadiusEnd = destinationData?.style?.borderRadius
				? destinationData?.style.borderRadius
				: 0

			borderRadius.value = interpolate(
				progress.value,
				[0, 1],
				[borderRadiusStart, borderRadiusEnd]
			)
			return {
				borderRadius: borderRadius.value,
			}
		})

		return (
			<>
				<WrappedComponent
					layout={
						LinearTransition
							.duration(TRANSITION_DURATION)
							.easing(TRANSITION_EASING)
					}
					style={[
						style,
						!destinationData?.measure ? {
							height: measure.height,
							width: measure.width,
							top: measure.y,
							left: measure.x
						} : {
							height: destinationData.measure.height,
							width: destinationData.measure.width,
							top: destinationData.measure.y,
							left: destinationData.measure.x
						},
						{
							position: 'absolute',
							transformOrigin: "left top",
							margin: 0,
							padding: 0,
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
