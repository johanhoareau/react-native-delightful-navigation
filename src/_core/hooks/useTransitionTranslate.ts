import { useEffect } from "react"
import { interpolate, useDerivedValue, useSharedValue, type SharedValue } from "react-native-reanimated"
import type { DestinationData, MeasuredDimensionsComponent } from "../../types/types"

export const useTransitionTranslate = (
	progress: SharedValue<number>,
	originMeasure: MeasuredDimensionsComponent,
	destinationData: DestinationData | undefined
) => {
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	const diffX = useSharedValue(0)
	const diffY = useSharedValue(0)

	useEffect(() => {
		if (destinationData?.measure) {
			diffX.value = destinationData.measure.x - originMeasure.x
			diffY.value = destinationData.measure.y - originMeasure.y
		}
	}, [destinationData])

	useDerivedValue(() => {
		if (diffX) {
			translateX.value = interpolate(
				progress.value,
				[0, 1],
				[0, diffX.value]
			)
		}
		if (diffY) {
			translateY.value = interpolate(
				progress.value,
				[0, 1],
				[0, diffY.value]
			)
		}
	})

	return {
		translateX,
		translateY
	}
}