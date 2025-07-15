import { LinearTransition } from "react-native-reanimated"
import { TRANSITION_DURATION, TRANSITION_EASING } from "../constants/transition"

export const useTransitionLayout = (style, measure, destinationData) => {
	const handlerTransitionLayout = LinearTransition.duration(TRANSITION_DURATION).easing(TRANSITION_EASING)

	const layoutStyle = !destinationData?.measure ?
		{
			height: measure.height,
			width: measure.width,
			top: measure.y,
			left: measure.x
		} : {
			height: destinationData.measure.height,
			width: destinationData.measure.width,
			top: destinationData.measure.y,
			left: destinationData.measure.x
		}


	// TODO: verify properties to reset (e.g. margin, padding)
	const animatedLayoutTransition = [
		style,
		layoutStyle,
		{
			position: 'absolute',
			transformOrigin: "left top",
			margin: 0,
			marginHorizontal: 0,
			marginVertical: 0,
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			padding: 0,
			paddingHorizontal: 0,
			paddingVertical: 0,
			paddingTop: 0,
			paddingRight: 0,
			paddingBottom: 0,
		}
	]

	return {
		handlerTransitionLayout,
		animatedLayoutTransition
	}
}