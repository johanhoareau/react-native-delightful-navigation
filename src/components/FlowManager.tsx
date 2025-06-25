import { StyleSheet, Text, View } from "react-native"
import type { FlowManagerProps } from "../types/props"
import { TemporaryTransitionComponents } from "../_core/components/TemporaryTransitionComponents"

export const FlowManager = ({ children }: FlowManagerProps) => {
	return (
		<View style={[StyleSheet.absoluteFill]}>
			{children}
			<TemporaryTransitionComponents />
		</View>
	)
}

const styles = StyleSheet.create({})
