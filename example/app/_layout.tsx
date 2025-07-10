import { Stack } from "expo-router"
import { FlowManager } from "react-native-delightful-navigation"

export default function RootLayout() {
	return (
		<FlowManager>
			<Stack
				screenOptions={{ headerShown: false }}
			/>
		</FlowManager>
	)
}
