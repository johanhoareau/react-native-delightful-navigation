import { useEffect } from 'react'
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSequence, withTiming, type SharedValue } from 'react-native-reanimated'

type ItemTextProps = {
	id: number,
	origin: SharedValue<string | null>
	transitionIsFinished: SharedValue<boolean>
}

export const ItemText = ({ id, origin, transitionIsFinished }: ItemTextProps) => {

	const textOpacity = useSharedValue(1)
	const textTranslateX = useSharedValue(0)

	// useEffect(() => {
	// 	textOpacity.value = withTiming(1, { duration: 5000 })
	// }, [])

	useAnimatedReaction(
		() => ({
			transitionIsFinished: transitionIsFinished.value,
			origin: origin.value
		}),
		(curr, _) => {
			if (curr.origin === `/details/${id}`) {
				if (!curr.transitionIsFinished) {
					textOpacity.value = 0
					textTranslateX.value = 20
				} else {
					textOpacity.value = withTiming(1, { duration: 300 })
					textTranslateX.value = withTiming(0, { duration: 300 })
				}
			}
		}
	)

	const textAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: textOpacity.value,
			transform: [
				{ translateX: textTranslateX.value }
			]
		}
	})

	return (
		<Animated.Text style={textAnimatedStyle}>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae tenetur excepturi quidem provident sequi
		</Animated.Text>
	)
}