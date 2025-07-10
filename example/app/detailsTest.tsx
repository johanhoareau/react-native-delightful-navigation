import { useNavigation } from "expo-router";
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import {
	useDelightfulTransition,
	XImage,
	XScreen,
	XText,
	XView,
} from "react-native-delightful-navigation"

export default function DetailsScreen() {
	const { register } = useDelightfulTransition("/details")

	return (
		<XScreen {...register}>
			<View style={styles.container}>

				<XView
					{...register}
					tag="button2"
					style={styles.button2}
				>
					<XImage
						{...register}
						tag="image"
						source={require("../assets/chameleon.jpg")}
						style={{ height: 200, width: "100%" }}
					/>
					<XText
						{...register}
						tag="text"
						style={{
							fontSize: 28
						}}
					>
						Test Details

					</XText>
					{/* <XView
						{...register}
						tag="inner-button"
						style={styles.innerButton}
					/> */}
				</XView>

				<XView
					{...register}
					tag="button1"
					style={styles.button}
				/>


				<XView
					{...register}
					tag="button3"
					style={styles.button}
				/>

				<XView
					{...register}
					tag="button4"
					style={styles.button}
				/>

				<XView
					{...register}
					tag="button5"
					style={styles.button}
				/>
				{/* <XView
					{...register}
					tag="button6"
					style={styles.button}
				/>
				<XView
					{...register}
					tag="button7"
					style={styles.button}
				/>
				<XView
					{...register}
					tag="button8"
					style={styles.button}
				/> */}
			</View>
		</XScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 30,
		// marginTop: 100
		// justifyContent: 'flex-end'
	},
	button: {
		padding: 10,
		borderWidth: 1,
		width: 50,
		height: 20,
		borderRadius: 100,
		backgroundColor: "lightblue",
	},
	button2: {
		// padding: 10,
		// borderRadius: 100,
		opacity: 1,
		// justifyContent: "flex-end",
		// alignItems: "flex-end",
		justifyContent: 'space-between',
		// borderWidth: 1,
		// backgroundColor: "orange",
		width: "100%",
		height: 220,
	},
	button3: {
		padding: 10,
		borderWidth: 1,
		width: 50,
		height: 150,
		margin: 20,
		borderRadius: 30,
		backgroundColor: "lightblue",
		alignSelf: "flex-end",

	},
	innerButton: {
		width: 100,
		height: 20,
		backgroundColor: "black",
		alignSelf: "flex-end",
	},
})
