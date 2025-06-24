import { Button, StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import {
	useDelightfulTransition,
	XScreen,
	XView,
} from "react-native-delightful-navigation"

export default function App() {
	const { register, navigateWithTransition } = useDelightfulTransition("/")

	const handlePress = () => {
		navigateWithTransition({
			destination: "/details",
			navigationCallback: () => console.log("navigate !"),
		})
		// console.log(JSON.stringify(register.registerRef.current, null, 2))
	}

	return (
		<XScreen {...register}>
			<XView
				{...register}
				tag="Page"
				style={styles.xView}
			>
				<View>
					<View>
						<XView
							{...register}
							tag="Header"
							style={styles.xView}
						>
							<XView
								{...register}
								tag="Nav"
								style={styles.xView}
							>
								<Text>Test nav</Text>
							</XView>
						</XView>
					</View>
				</View>
				<XView
					{...register}
					tag="Main"
					style={styles.xView}
				>
					<XView
						{...register}
						tag="Sidebar"
						style={styles.xView}
					>
						<XView
							{...register}
							tag="Menu 1"
							style={styles.xView}
						/>
						<XView
							{...register}
							tag="Menu 2"
							style={styles.xView}
						/>
					</XView>
					<XView
						{...register}
						tag="Content"
						style={styles.xView}
					>
						<XView
							{...register}
							tag="Article 1"
							style={styles.xView}
						/>
						<XView
							{...register}
							tag="Article 2"
							style={styles.xView}
						/>
					</XView>
				</XView>
				<XView
					{...register}
					tag="Footer"
					style={styles.xView}
				/>
			</XView>
			<View style={styles.buttonNavigation}>
				<Button
					title="Navigate"
					onPress={handlePress}
				/>
			</View>
		</XScreen>
	)
}

const styles = StyleSheet.create({
	xView: {
		borderWidth: 1,
		padding: 9,
		gap: 20,
		flex: 1,
	},
	buttonNavigation: {
		marginBottom: 50,
	},
})
