import { useEffect } from "react"
import { interpolate, useDerivedValue, useSharedValue, type SharedValue } from "react-native-reanimated"
import type { DestinationData, MeasuredDimensionsComponent } from "../../types/types"

export const useTransitionScale = (
	progress: SharedValue<number>,
	originMeasure: MeasuredDimensionsComponent,
	destinationData: DestinationData | undefined
) => {
	const scaleX = useSharedValue(1)
	const scaleY = useSharedValue(1)
	const scaleXEnd = useSharedValue(1)
	const scaleYEnd = useSharedValue(1)

	useEffect(() => {
		if (destinationData?.measure) {
			scaleXEnd.value = destinationData.measure.width / originMeasure.width
			scaleYEnd.value = destinationData.measure.height / originMeasure.height
		}
	}, [destinationData])

	useDerivedValue(() => {
		scaleX.value = interpolate(
			progress.value,
			[0, 1],
			[1, scaleXEnd.value]
		)
		scaleY.value = interpolate(
			progress.value,
			[0, 1],
			[1, scaleYEnd.value]
		)
	})
	return {
		scaleX,
		scaleY
	}
}