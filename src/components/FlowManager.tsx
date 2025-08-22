/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { StyleSheet, View } from "react-native"
import type { FlowManagerProps } from "../types/props"
import { DisplayerTemporaryComponents } from "../_core/components/DisplayerTemporaryComponents"

export const FlowManager = ({ children }: FlowManagerProps) => {
	return (
		<View style={[StyleSheet.absoluteFill]}>
			{children}
			<DisplayerTemporaryComponents />
		</View>
	)
}
