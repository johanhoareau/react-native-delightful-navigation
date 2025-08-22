/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { Pressable, StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"
import type { SharedValue } from "react-native-reanimated"
import Animated, {
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated"

type Props = {
	title: string
	route: string
	transitionIsFinished: SharedValue<boolean>
	origin: SharedValue<string | null>
}

const NavigationListButton = ({
	title,
	route,
	transitionIsFinished,
	origin
}: Props) => {
	const router = useRouter()

	const opacity = useSharedValue(0)

	useAnimatedReaction(
		() => ({
			transitionIsFinished: transitionIsFinished.value,
			origin: origin.value,
		}),
		(curr, _) => {
			console.log(curr);

			if (curr.origin === `/basic`) {
				if (!curr.transitionIsFinished) {
					opacity.value = withTiming(0, { duration: 0 })
				} else {
					opacity.value = withTiming(1, { duration: 300 })
				}
			} else {
				console.log("Here");

				opacity.value = withTiming(1, { duration: 300 })
			}
		}
	)

	const animatedStyleContainer = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}))

	const handlePress = () => {
		router.navigate(route)
	}

	return (
		<Pressable onPress={handlePress}>
			<Animated.View style={[styles.container, animatedStyleContainer]}>
				<Text style={styles.buttonText}>{title}</Text>
			</Animated.View>
		</Pressable>
	)
}

export default NavigationListButton

const styles = StyleSheet.create({
	container: {
		borderWidth: 2,
		borderColor: "#338",
		borderRadius: 5,
		// paddingVertical: 17,
		height: 60,
		width: 250,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: '#fff'
	},
	buttonText: {
		color: "#338",
		fontWeight: "bold"
	}
})
