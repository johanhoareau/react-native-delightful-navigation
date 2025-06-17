import { useRouter } from "expo-router"
import { Text, View, StyleSheet, Pressable } from "react-native"
import {
	multiply,
	useDelightfulTransition,
	XView,
} from "react-native-delightful-navigation"

const result = multiply(3, 7)

export default function App() {
	const router = useRouter()
	const { register, navigateWithTransition } = useDelightfulTransition("/")

	const handleNavigation = () => {
		navigateWithTransition({
			destination: "/details",
			navigationCallback: () => {
				router.navigate("/details")
			},
		})
	}

	return (
		<View style={styles.container}>
			<Text>Result: {result}</Text>
			<XView
				{...register}
				tag="button1"
				style={styles.button}
			/>
			<XView
				{...register}
				tag="button2"
				style={styles.button2}
			>
				<XView
					{...register}
					tag="inner-button"
					style={styles.innerButton}
				/>
			</XView>
			{/* <XView
				{...register}
				tag="button3"
				style={styles.button}
			/> */}
			<Pressable onPress={handleNavigation}>
				<Text>Go to Details</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 50,
	},
	button: {
		margin: 20,
		padding: 10,
		borderWidth: 1,
		width: 100,
		height: 100,
		backgroundColor: "lightblue",
	},
	button2: {
		margin: 20,
		padding: 10,
		borderWidth: 1,
		opacity: 0.5,
		width: "100%",
		height: 100,
		backgroundColor: "orange",
	},
	innerButton: {
		width: 20,
		aspectRatio: 1 / 1,
		backgroundColor: "grey",
	},
})
