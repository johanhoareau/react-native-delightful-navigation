/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import {
	FlatList,
	Pressable,
	StyleSheet,
	View,
} from "react-native"
import {
	useDelightfulTransition,
	SharedImage,
	Screen,
	SharedText,
	SharedView,
} from "react-native-delightful-navigation"
import { useNavigation, useRouter } from "expo-router"
import { ELEMENTS } from "../../constants"
import { ItemText } from "../../components/ItemText"

export default function TransitionWithList() {
	const router = useRouter()
	const navigation = useNavigation()
	const { register, navigateWithTransition, transitionIsFinished, origin } =
		useDelightfulTransition("/with-list")

	const handleNavigationToDetails = (id: number) => {
		navigateWithTransition({
			destination: `/with-list/details/${id}`,
			navigationCallback: () => router.navigate(`/with-list/details/${id}`),
			itemsListToInclude: [
				`container-${id}`,
				`image-${id}`,
				`text-container-${id}`,
				`title-${id}`,
			],
			config: {
				duration: 750,
				// easing: Easing.bounce
			},
		})
	}

	return (
		<>
			<Screen {...register} navigation={navigation}>
				<View style={styles.container}>
					<FlatList
						data={ELEMENTS}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => {
							return (
								<Pressable onPress={() => handleNavigationToDetails(item.id)}>
									<SharedView
										{...register}
										tag={`container-${item.id}`}
										style={styles.item}
									>
										<SharedImage
											{...register}
											tag={`image-${item.id}`}
											source={item.image}
											style={styles.image}
										/>
										<View style={{ flex: 1, gap: 5 }}>
											<SharedView
												{...register}
												tag={`text-container-${item.id}`}
												style={styles.textContainer}
											>
												<SharedText
													{...register}
													tag={`title-${item.id}`}
													style={styles.title}
												>
													{item.title}
												</SharedText>
											</SharedView>
											<ItemText
												id={item.id}
												origin={origin}
												transitionIsFinished={transitionIsFinished}
											/>
										</View>
									</SharedView>
								</Pressable>
							)
						}}
					/>
				</View>
			</Screen>
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
		alignItems: "center",
	},
	image: {
		height: 75,
		width: 75,
		borderRadius: 75,
	},
	textContainer: {
		backgroundColor: "#338",
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
		color: "#fff",
	},
})
