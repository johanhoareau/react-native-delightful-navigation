import type { InProgressXComponentData } from "../../types/types"

export const checkIfAllComponentsDataOriginAreSaved = (
	xComponentsData: InProgressXComponentData[] | undefined
) => {
	const arrayOfIsDataSaved = xComponentsData?.map((el) => !!el.measure)
	const hasLeastOneNotSaved = arrayOfIsDataSaved?.includes(false)
	const isAllSaved =
		hasLeastOneNotSaved !== undefined ? !hasLeastOneNotSaved : false

	return isAllSaved
}
