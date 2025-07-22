import { useEffect } from "react"
import { runOnJS, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated"
import { useTransitionStore } from "../stores/useTransitionStore"
import { TRANSITION_DURATION, TRANSITION_EASING } from "../constants/transition"
import type { DestinationXData, TransitionTag } from "../../types/types"

type TransitionProgressHook = (
	tag: TransitionTag,
	destinationData?: DestinationXData
) => {
	progress: SharedValue<number>
}

export const useTransitionProgress: TransitionProgressHook = (tag, destinationData) => {
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