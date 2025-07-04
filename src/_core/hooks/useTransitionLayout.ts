import { Easing, LinearTransition } from "react-native-reanimated"
import { TRANSITION_DURATION, TRANSITION_EASING } from "../constants/transition"

export const useTransitionLayout = (style, measure, destinationData) => {
	const handlerTransitionLayout = LinearTransition.duration(TRANSITION_DURATION).easing(TRANSITION_EASING)

	const animatedLayoutTransition = [
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
		}
	]

	return {
		handlerTransitionLayout,
		animatedLayoutTransition
	}
}