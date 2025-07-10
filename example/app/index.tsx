import { Button, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {
	useDelightfulTransition,
	XImage,
	XScreen,
	XText,
	XView,
} from "react-native-delightful-navigation"
import { useRouter } from "expo-router"
import { ELEMENTS, type ItemList } from "../constants"

export default function App() {
	const router = useRouter()
	const { register, navigateWithTransition, setRegisterList } = useDelightfulTransition("/")


	// const handleNavigation = () => {
	// 	navigateWithTransition({
	// 		destination: "/details",
	// 		navigationCallback: () => {
	// 			router.navigate("/details")
	// 		},
	// 		includes: ["text", "image"]
	// 	})
	// }

	const handleNavigationToDetails = (id: number) => {
		navigateWithTransition({
			destination: `/details/${id}`,
			navigationCallback: () => {
				router.navigate(`/details/${id}`)
			},
			itemsListToInclude: [
				`container-${id}`,
				`image-${id}`,
				`title-${id}`
			]
		})
	}


	return (
		<XScreen {...register}>
			<View style={styles.container}>
				<FlatList
					data={ELEMENTS}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity onPress={() => handleNavigationToDetails(item.id)}>
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
										<XText
											{...register}
											tag={`title-${item.id}`}
											style={styles.title}
										>
											{item.title}
										</XText>
										<Text>
											Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae tenetur excepturi quidem provident sequi
										</Text>
									</View>
								</XView>
							</TouchableOpacity>
						)
					}}
				/>
			</View>
		</XScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 50,
		// backgroundColor: '#307'
	},
	item: {
		flex: 1,
		// height: 75,
		// borderWidth: 1,
		borderRadius: 5,
		borderColor: "#AAA",
		marginBottom: 25,
		padding: 10,
		flexDirection: "row",
		gap: 20,
		marginHorizontal: 10,
		alignItems: 'center',
	},
	image: {
		height: 75,
		width: 75,
		borderRadius: 75
	},
	title: {
		fontSize: 18,
		fontWeight: "400",
		// color: "#000"
	}

})
