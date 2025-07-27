import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useDelightfulTransition, XImage, XScreen, XText, XView } from 'react-native-delightful-navigation'
import { ELEMENTS } from '../../constants'
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Details() {
	const { id } = useLocalSearchParams()
	const { register, transitionIsFinished } = useDelightfulTransition(`/details/${id}`)

	const item = ELEMENTS?.find(el => el.id.toString() === id)
	const navigation = useNavigation()


	const textOpacity = useSharedValue(0)
	const textTranslateY = useSharedValue(30)
	const galleryOpacity = useSharedValue(0)
	const galleryTranslateY = useSharedValue(30)

	useAnimatedReaction(
		() => transitionIsFinished.value,
		(curr, _) => {
			if (curr) {
				textOpacity.value = withTiming(1)
				textTranslateY.value = withTiming(0)

				galleryOpacity.value = withDelay(200, withTiming(1))
				galleryTranslateY.value = withDelay(200, withTiming(0))
			}
		}
	)

	const animatedTextStyle = useAnimatedStyle(() => ({
		opacity: textOpacity.value,
		transform: [
			{ translateY: textTranslateY.value }
		]
	}
	))

	const animatedGalleryStyle = useAnimatedStyle(() => {
		return {
			opacity: galleryOpacity.value,
			transform: [
				{ translateY: galleryTranslateY.value }
			]
		}
	})

	return (
		<XScreen {...register} navigation={navigation}>
			<XView
				{...register}
				tag={`container-${id}`}
				style={styles.container}
			>

				<XImage
					{...register}
					tag={`image-${id}`}
					source={item?.image}
					style={styles.image}
				/>

				<XView
					{...register}
					tag={`text-container-${id}`}
					style={styles.textContainer}
				>
					<XText
						{...register}
						tag={`title-${id}`}
						style={styles.title}
					>
						{item?.title}
					</XText>

				</XView>

				<Animated.Text style={[{ paddingHorizontal: 20 }, animatedTextStyle]}>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores repellat quis voluptatum earum. Repellat architecto labore ea eius odio dolorem, rem nemo enim eum itaque officiis quaerat velit error est.
					Nulla, illum consectetur! Nesciunt, eius neque! Fugiat tempore recusandae cumque amet doloribus quae iste at commodi sint voluptatem minima saepe quibusdam illo harum ea animi ipsum, repudiandae deserunt necessitatibus autem.
				</Animated.Text>

				<Animated.View style={[styles.galleryContainer, animatedGalleryStyle]}>
					<View style={styles.galleryRow}>
						<View style={styles.galleryItem}></View>
						<View style={styles.galleryItem}></View>
						<View style={styles.galleryItem}></View>
					</View>
					<View style={styles.galleryRow}>
						<View style={styles.galleryItem}></View>
						<View style={styles.galleryItem}></View>
						<View style={styles.galleryItem}></View>
					</View>
				</Animated.View>

			</XView>

		</XScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		gap: 20
	},
	image: {
		width: "100%",
		height: 200,
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
		color: "#FFF",
	},
	textContainer: {
		backgroundColor: "#338",
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		borderRadius: 5,
		left: 20,
	},
	galleryContainer: {
		gap: 5,
		padding: 20,
	},
	galleryRow: {
		flexDirection: 'row',
		gap: 5,
	},
	galleryItem: {
		flex: 1,
		height: 30,
		aspectRatio: 1 / 1,
		backgroundColor: '#DDD',
	}
})