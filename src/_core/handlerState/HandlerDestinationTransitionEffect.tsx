/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { useEffect } from "react";
import { useHeaderHeight } from '@react-navigation/elements';
import { useTransitionStore } from "../stores/useTransitionStore";
import { measure, runOnJS, useAnimatedReaction, useSharedValue, withTiming, type AnimatedRef, type SharedValue } from "react-native-reanimated";
import { Platform } from "react-native";

type Props = {
	landmarkRef: AnimatedRef<React.Component<{}, {}, any>>,
	transitionIsFinished: SharedValue<boolean>,
	origin: SharedValue<string | null>,
}

const HandlerDestinationTransitionEffect = ({ landmarkRef, transitionIsFinished, origin }: Props) => {
	const headerHeight = useHeaderHeight()
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")
	const isStatusOnEnd = useTransitionStore(state => state.status === "end transition")
	const originRoute = useTransitionStore(state => state.origin?.route)
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const setHasDifferencePosYDetected = useTransitionStore(state => state.setHasDifferencePosYDetected)
	const indexBackTransitionIntoHistory = useTransitionStore(state => state.indexBackTransitionIntoHistory)

	const timeToMeasurement = useSharedValue(0)
	const pageY = useSharedValue(0)
	const firstHeaderHeight = useSharedValue(0)
	const sharedHeaderHeight = useSharedValue(0)
	const startTransition = useSharedValue(0)

	// Set data for entering animation after transition is finished
	useEffect(() => {
		if (isStatusOnNavigation) {
			origin.value = originRoute ? originRoute : null
			transitionIsFinished.value = false
		}
		if (isStatusOnEnd) {
			transitionIsFinished.value = true
		}
	}, [isStatusOnNavigation, isStatusOnEnd])


	// useEffect(() => {
	// 	if (isStatusOnBackNavigation) {
	// 		setStatusTransition("start transition")
	// 	}
	// }, [isStatusOnBackNavigation])


	// If destination screen, check when new screen layout is stable to start measurements of destination components
	useAnimatedReaction(
		() => timeToMeasurement.value,
		(curr, prev) => {
			if (!prev) return
			if (curr !== prev) {
				const measurement = measure(landmarkRef)
				if (measurement) {
					if (firstHeaderHeight.value === 0) {
						console.log("FHH -->>", firstHeaderHeight.value, headerHeight);
						firstHeaderHeight.value = Math.round(headerHeight)
					}
					pageY.value = Math.round(measurement.pageY)
					sharedHeaderHeight.value = Math.round(headerHeight)
				}
			}
		}
	)

	useAnimatedReaction(
		() => pageY.value,
		(curr) => {
			const roundedCurr = Math.round(curr)
			if (
				Platform.OS === "android" && roundedCurr > 56
				|| Platform.OS === "ios" && roundedCurr > 44
			) {
				console.log("START TRANSITION -- PLATFORM", roundedCurr, firstHeaderHeight.value);
				startTransition.value = 1
			}
		}
	)

	useAnimatedReaction(
		() => sharedHeaderHeight.value,
		(curr, prev) => {
			if (!curr) return
			if (curr === firstHeaderHeight.value && pageY.value >= firstHeaderHeight.value) {
				startTransition.value = 1
			} else if (prev !== curr) {
				if (curr > firstHeaderHeight.value && !startTransition.value) {
					console.log("START TRANSITION -- firstHeaderHeightTrigger", firstHeaderHeight.value, curr, pageY.value);
					if (!pageY.value || pageY.value < firstHeaderHeight.value) {
						console.log("HERE", firstHeaderHeight.value, sharedHeaderHeight.value);
						// landmarkHeight.value = withTiming(firstHeaderHeight.value, { duration: 0 })
						runOnJS(setHasDifferencePosYDetected)(firstHeaderHeight.value - pageY.value)
						startTransition.value = 1
					}
				}
			}
		}
	)

	useAnimatedReaction(
		() => startTransition.value,
		(curr, prev) => {
			console.log(prev, curr);

			if (curr !== prev && curr === 1) {
				console.log("animatedReaction start transition");
				runOnJS(setStatusTransition)("start transition")
			}
		}
	)

	useEffect(() => {
		if (!isStatusOnNavigation) return
		if (!headerHeight || indexBackTransitionIntoHistory !== null) {
			console.log("start transition");

			setStatusTransition("start transition")
		} else {
			console.log("start TIMER", timeToMeasurement.value);
			if (timeToMeasurement.value === 0) {
				timeToMeasurement.value = withTiming(1,
					{ duration: 500 },
					(finished) => {
						if (finished) {
							if (!startTransition.value) {
								console.log("FINAL");

								startTransition.value = 1
							}
						}
					}
				)
			}
		}


	}, [isStatusOnNavigation, headerHeight, indexBackTransitionIntoHistory])
	return (
		<></>
	)
}

export default HandlerDestinationTransitionEffect