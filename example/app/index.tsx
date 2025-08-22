/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { Pressable, StyleSheet } from "react-native"
import {
	useDelightfulTransition,
	Screen,
	SharedText,
	SharedView,
} from "react-native-delightful-navigation"
import { useNavigation, useRouter } from "expo-router"
import NavigationListButton from "../components/NavigationListButton"

const Home = () => {
	const { register, navigateWithTransition, transitionIsFinished, origin } =
		useDelightfulTransition("/")

	const navigation = useNavigation()
	const router = useRouter()

	const handlePress = () => {
		navigateWithTransition({
			destination: "/basic",
			navigationCallback: () => router.navigate("/basic"),
			config: { duration: 750 },
		})
	}

	return (
		<Screen
			{...register}
			navigation={navigation}
			style={styles.container}
		>
			<Pressable onPress={handlePress}>
				<SharedView
					{...register}
					tag="button-container"
					style={styles.buttonBasic}
				>
					<SharedText
						{...register}
						tag="button-text"
						style={styles.buttonBasicText}
					>
						Basic navigation
					</SharedText>
				</SharedView>
			</Pressable>
			<NavigationListButton
				title="Navigation with list"
				route="/with-list"
				transitionIsFinished={transitionIsFinished}
				origin={origin}
			/>
		</Screen>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 50,
	},
	buttonBasic: {
		borderWidth: 2,
		borderColor: "#338",
		borderRadius: 5,
		height: 60,
		width: 250,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: '#fff'
	},
	buttonBasicText: {
		color: "#338",
		fontWeight: "bold"
	}
})
