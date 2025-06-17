import { StyleSheet, Text, View } from "react-native"
import {
	useDelightfulTransition,
	XView,
} from "react-native-delightful-navigation"

export default function DetailsScreen() {
	const { register } = useDelightfulTransition("/details")
	return (
		<View style={styles.container}>
			<Text>Test Details</Text>

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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	button: {
		padding: 10,
		borderWidth: 1,
		width: 100,
		height: 100,
		borderRadius: 100,
		backgroundColor: "lightblue",
		justifyContent: "center",
		alignItems: "flex-end",
	},
	button2: {
		padding: 10,
		borderRadius: 100,
		opacity: 0.5,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		borderWidth: 1,
		backgroundColor: "orange",
		width: "100%",
		height: 100,
	},
	innerButton: {
		width: 20,
		aspectRatio: 1 / 1,
		backgroundColor: "grey",
	},
})
