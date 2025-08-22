/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { FlowManager } from "react-native-delightful-navigation"

export default function RootLayout() {
	return (
		<FlowManager>
			<StatusBar hidden />
			<Stack
			// screenOptions={{ headerShown: false }}
			/>
		</FlowManager>
	)
}
