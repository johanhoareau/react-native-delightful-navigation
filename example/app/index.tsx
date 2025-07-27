import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import {
	useDelightfulTransition,
	XImage,
	XScreen,
	XText,
	XView,
} from "react-native-delightful-navigation"
import { useRouter } from "expo-router"
import { ELEMENTS } from "../constants"
import { ItemText } from "../components/ItemText"

export default function App() {
	const router = useRouter()
	const { register, navigateWithTransition, transitionIsFinished, origin } = useDelightfulTransition("/")


	const handleNavigationToDetails = (id: number) => {
		navigateWithTransition({
			destination: `/details/${id}`,
			navigationCallback: () => router.navigate(`/details/${id}`),
			itemsListToInclude: [
				`container-${id}`,
				`image-${id}`,
				`text-container-${id}`,
				`title-${id}`
			]
		})
	}


	return (
		<>
			<XScreen {...register}>
				<View style={styles.container}>
					<FlatList
						data={ELEMENTS}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => {
							return (
								<Pressable onPress={() => handleNavigationToDetails(item.id)}>
									<XView
										{...register}
										tag={`container-${item.id}`}
										style={styles.item}
									>
										<XImage
											{...register}
											tag={`image-${item.id}`}
											source={item.image}
											style={styles.image}
										/>
										<View style={{ flex: 1, gap: 5 }}>
											<XView
												{...register}
												tag={`text-container-${item.id}`}
												style={styles.textContainer}
											>

												<XText
													{...register}
													tag={`title-${item.id}`}
													style={styles.title}
												>
													{item.title}
												</XText>
											</XView>
											<ItemText
												id={item.id}
												origin={origin}
												transitionIsFinished={transitionIsFinished}
											/>
										</View>
									</XView>
								</Pressable>
							)
						}}
					/>
				</View>
			</XScreen>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		borderRadius: 5,
		backgroundColor: "white",
		marginBottom: 25,
		padding: 10,
		flexDirection: "row",
		gap: 20,
		marginHorizontal: 30,
		alignItems: 'center',
	},
	image: {
		height: 75,
		width: 75,
		borderRadius: 75
	},
	textContainer: {
		backgroundColor: "#338",
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
		color: "#fff",
	}

})
