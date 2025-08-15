/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import type { XData, XDataInProgress } from "../../types/types"

export const checkIfAllComponentsDataOriginAreSaved = (
	xComponentsData: XData[] | XDataInProgress[] | undefined
) => {
	const arrayOfIsDataSaved = xComponentsData?.map((el) => !!el.measure)
	const hasLeastOneNotSaved = arrayOfIsDataSaved?.includes(false)
	const isAllSaved =
		hasLeastOneNotSaved !== undefined ? !hasLeastOneNotSaved : false

	return isAllSaved
}
