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
