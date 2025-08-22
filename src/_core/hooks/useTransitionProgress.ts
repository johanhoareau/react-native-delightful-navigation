/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


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
	const config = useTransitionStore(state => state.config)
	const setTransitionComponentIsFinished = useTransitionStore(state => state.setTransitionComponentIsFinished)
	const progress = useSharedValue(0)

	useEffect(() => {
		if (destinationData && !destinationData.isTransitionFinished) {

			progress.value = withTiming(1,
				{
					duration: config.duration,
					easing: config.easing
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