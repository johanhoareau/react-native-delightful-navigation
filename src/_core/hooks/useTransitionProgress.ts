import { useEffect } from "react"
import { runOnJS, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated"
import { useTransitionStore } from "../stores/useTransitionStore"
import type { DestinationXData, TransitionTag } from "../../types/types"

type TransitionProgressHook = (
	tag: TransitionTag,
	destinationData?: DestinationXData
) => {
	progress: SharedValue<number>
}

export const useTransitionProgress: TransitionProgressHook = (tag, destinationData) => {
	const options = useTransitionStore(state => state.options)
	const setTransitionComponentIsFinished = useTransitionStore(state => state.setTransitionComponentIsFinished)
	const progress = useSharedValue(0)

	useEffect(() => {
		if (destinationData && !destinationData.isTransitionFinished) {

			progress.value = withTiming(1,
				{
					duration: options.duration,
					easing: options.easing
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