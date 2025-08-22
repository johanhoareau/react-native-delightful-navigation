/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { Pressable, StyleSheet, Text } from "react-native"
import {
	useDelightfulTransition,
	Screen,
	SharedText,
	SharedView,
} from "react-native-delightful-navigation"
import { useNavigation, useRouter } from "expo-router"
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const test = () => {
	const navigation = useNavigation()
	const router = useRouter()
	const { register, transitionIsFinished } = useDelightfulTransition("/basic")

	const textOpacity = useSharedValue(0)
	const textTranslateY = useSharedValue(-50)
	const arrowTranslateX = useSharedValue(25)

	useAnimatedReaction(
		() => transitionIsFinished.value,
		(curr, _) => {
			if (curr) {
				const config = { duration: 300 }
				textOpacity.value = withTiming(1, config)
				textTranslateY.value = withTiming(-20, config)
				arrowTranslateX.value = withTiming(0, config)
			}
		}
	)

	const animatedTextStyle = useAnimatedStyle(() => ({
		opacity: textOpacity.value,
		transform: [{ translateY: textTranslateY.value }],
	}))

	const animatedArrowStyle = useAnimatedStyle(() => ({
		opacity: textOpacity.value,
		transform: [{ translateX: arrowTranslateX.value }]

	}))

	return (
		<Screen
			{...register}
			navigation={navigation}
			style={styles.container}
		>
			<Animated.View style={[styles.textContainer, animatedTextStyle]}>
				<Text style={styles.text}>Welcome</Text>
				<Text style={styles.text}>and thank you for using my library</Text>
			</Animated.View>
			<Pressable onPress={() => router.back()}>
				<SharedView
					{...register}
					tag="button-container"
					style={styles.buttonContainer}
				>
					<Animated.Text style={[styles.buttonText, animatedArrowStyle, { fontSize: 32 }]}>{"<"}</Animated.Text>
					<SharedText
						{...register}
						tag="button-text"
						style={[styles.buttonText]}
					>
						Basic navigation
					</SharedText>
				</SharedView>
			</Pressable>
		</Screen>
	)
}

export default test

const styles = StyleSheet.create({
	container: {
		marginVertical: 100,
		justifyContent: "space-between",
		alignItems: "center",
	},
	textContainer: {
		flex: 1,
		width: "100%",
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 35,
	},
	text: {
		color: "#338",
		fontSize: 36,
		fontWeight: "bold",
		textAlign: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: "#338",
		borderRadius: 5,
		width: 250,
		backgroundColor: '#fff',
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 25,
		height: 60,
	},
	buttonText: {
		color: "#338",
		fontWeight: "bold",
		// borderWidth: 1,
	}
})
