import { useEffect } from "react"
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated"
import { useTransitionStore } from "../stores/useTransitionStore"
import { TRANSITION_DURATION, TRANSITION_EASING } from "../constants/transition"

export const useTransitionProgress = (tag, destinationData) => {
	const setTransitionComponentIsFinished = useTransitionStore(state => state.setTransitionComponentIsFinished)
	const progress = useSharedValue(0)

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

	return {
		progress
	}
}