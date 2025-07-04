import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, type SharedValue } from "react-native-reanimated"
import type { DestinationXData, Style } from "../../types/types"
import { StyleSheet, type TextStyle } from "react-native"

export const useTransitionFont = (
	progress: SharedValue<number>,
	originStyle: Style,
	destinationData: DestinationXData | undefined
) => {
	const originFlatStyle = StyleSheet.flatten<TextStyle>(originStyle)
	const destinationFlatStyle = StyleSheet.flatten<TextStyle>(destinationData?.style)

	const fontSize = useSharedValue(originFlatStyle.fontSize ? originFlatStyle.fontSize : 14)

	const animatedFont = useAnimatedStyle(() => {
		const fontSizeStart = originFlatStyle.fontSize ? originFlatStyle.fontSize : 14
		const fontSizeEnd = destinationFlatStyle?.fontSize ? destinationFlatStyle.fontSize : 14

		fontSize.value = interpolate(
			progress.value,
			[0, 1],
			[fontSizeStart, fontSizeEnd],
			Extrapolation.CLAMP
		)

		return {
			fontSize: fontSize.value
		}
	})

	return {
		animatedFont
	}
}