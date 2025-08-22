/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, type SharedValue } from "react-native-reanimated"
import type { DestinationXData, Style } from "../../types/types"
import { StyleSheet, type TextStyle } from "react-native"


const DEFAULT_FONT_SIZE = 14

export const useTransitionFont = (
	progress: SharedValue<number>,
	originStyle: Style,
	destinationData: DestinationXData | undefined
) => {
	const originFlatStyle = StyleSheet.flatten<TextStyle>(originStyle)
	const destinationFlatStyle = StyleSheet.flatten<TextStyle>(destinationData?.style)

	const fontSize = useSharedValue(originFlatStyle?.fontSize ? originFlatStyle.fontSize : DEFAULT_FONT_SIZE)
	const animatedFont = useAnimatedStyle(() => {
		const fontSizeStart = originFlatStyle?.fontSize ? originFlatStyle.fontSize : DEFAULT_FONT_SIZE
		const fontSizeEnd = destinationFlatStyle?.fontSize ? destinationFlatStyle.fontSize : DEFAULT_FONT_SIZE
		fontSize.value = interpolate(
			progress.value,
			[0, 1],
			[fontSizeStart, fontSizeEnd],
			Extrapolation.CLAMP
		)

		return {
			fontSize: fontSize.value,
		}
	})

	return {
		animatedFont
	}
}