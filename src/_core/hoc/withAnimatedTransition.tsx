import {
	interpolate,
	useAnimatedStyle,
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
		const { tag, measure, style, ...restProps } = props
		const destinationData = useTransitionStore((state) =>
			state.destination?.xComponentsData.find((el) => el.tag === tag)
		)

		const progress = useSharedValue(0)
		const xTranslation = useSharedValue(0)
		const yTranslation = useSharedValue(0)
		const borderRadius = useSharedValue(style.borderRadius)

		if (tag === "button2") {
			console.log("button2", measure);

		}

		useEffect(() => {
			if (destinationData) {
				progress.value = withDelay(100, withTiming(1))
			}
		}, [destinationData])

		const animatedTransitionStyle = useAnimatedStyle(() => {
			let diffX = 0
			let diffY = 0
			if (destinationData?.measure) {
				diffX = destinationData.measure.x - measure.x
				diffY = destinationData.measure.y - measure.y
			}
			const borderRadiusStart = style?.borderRadius ? style.borderRadius : 0
			const borderRadiusEnd = destinationData?.style?.borderRadius
				? destinationData?.style.borderRadius
				: 0

			if (diffX) {
				xTranslation.value = interpolate(progress.value, [0, 1], [0, diffX])
			}
			if (diffY) {
				yTranslation.value = interpolate(progress.value, [0, 1], [0, diffY])
			}
			borderRadius.value = interpolate(
				progress.value,
				[0, 1],
				[borderRadiusStart, borderRadiusEnd]
			)

			return {
				transform: [
					{ translateX: xTranslation.value },
					{ translateY: yTranslation.value },
				],
				borderRadius: borderRadius.value,
			}
		})

		return (
			<>
				<WrappedComponent
					style={[
						style,
						{
							height: measure.height,
							width: measure.width,
							margin: 0,
							padding: 0,
							left: measure.x,
							top: measure.y
						},
						animatedTransitionStyle,
						{ position: "absolute", backgroundColor: "green" }
					]}
				// {...(restProps as T)}
				/>
			</>
		)
	}
	return ComponentWithAnimatedTransition
}

export default withAnimatedTransition
