import { useNavigation } from "expo-router";
import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import {
	useDelightfulTransition,
	XScreen,
	XView,
} from "react-native-delightful-navigation"

export default function DetailsScreen() {
	const { register, setNativeTransitionEnd } = useDelightfulTransition("/details")
	const navigation: any = useNavigation(); // bypass des types

	useEffect(() => {
		const unsub = navigation.addListener('transitionEnd', (e: any) => {
			if (!e.data.closing) {
				console.log('✅ Transition d’entrée terminée');
				setNativeTransitionEnd(true)
			}
		});
		return unsub;
	}, [navigation]);


	return (
		<XScreen {...register}>
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

				<XView
					{...register}
					tag="button3"
					style={styles.button3}
				/>
			</View>
		</XScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 10,
	},
	button: {
		padding: 10,
		borderWidth: 1,
		width: 100,
		height: 100,
		borderRadius: 100,
		backgroundColor: "lightblue",
	},
	button2: {
		padding: 10,
		borderRadius: 100,
		opacity: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		borderWidth: 1,
		backgroundColor: "orange",
		width: "100%",
		height: 100,
	},
	button3: {
		padding: 10,
		borderWidth: 3,
		width: 50,
		height: 150,
		// borderRadius: 30,
		backgroundColor: "lightblue",
		alignSelf: "flex-end",
	},
	innerButton: {
		width: 20,
		aspectRatio: 1 / 1,
		backgroundColor: "black",
		alignSelf: "flex-end",
	},
})
