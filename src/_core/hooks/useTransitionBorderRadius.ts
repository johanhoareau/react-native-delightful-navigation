import { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, type SharedValue } from "react-native-reanimated"
import type { DestinationXData, Style } from "../../types/types"
import { StyleSheet, type ViewStyle } from "react-native"

export const useTransitionBorderRadius = (
	progress: SharedValue<number>,
	originStyle: Style,
	destinationData: DestinationXData | undefined
) => {
	const originFlatStyle = StyleSheet.flatten<ViewStyle>(originStyle)
	const destinationFlatStyle = StyleSheet.flatten<ViewStyle>(destinationData?.style)


	const borderRadius = useSharedValue(originFlatStyle?.borderRadius ? originFlatStyle.borderRadius : 0)

	const animatedBorderRadius = useAnimatedStyle(() => {

		const borderRadiusStart = originFlatStyle?.borderRadius
			? originFlatStyle.borderRadius as number
			: 0

		const borderRadiusEnd = destinationFlatStyle?.borderRadius
			? destinationFlatStyle?.borderRadius as number
			: 0


		borderRadius.value = interpolate(
			progress.value,
			[0, 1],
			[borderRadiusStart, borderRadiusEnd],
			Extrapolation.CLAMP
		)
		return {
			borderRadius: borderRadius.value,
		}
	})

	return { animatedBorderRadius }
}