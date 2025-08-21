/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { LinearTransition } from "react-native-reanimated"
import type { DestinationXData, MeasuredDimensionsComponent, Style } from "../../types/types"
import { useTransitionStore } from "../stores/useTransitionStore"

type TransitionLayoutHook = (
	style: Style,
	measure: MeasuredDimensionsComponent,
	destinationData?: DestinationXData
) => {
	handlerTransitionLayout: LinearTransition,
	animatedLayoutTransition: Style[]
}

export const useTransitionLayout: TransitionLayoutHook = (style, measure, destinationData) => {
	const config = useTransitionStore(state => state.config)
	const handlerTransitionLayout = LinearTransition.duration(config.duration).easing(config.easing)

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
	const animatedLayoutTransition: Style[] = [
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