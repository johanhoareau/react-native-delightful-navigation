import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useDelightfulTransition, XImage, XScreen, XText, XView } from 'react-native-delightful-navigation'
import { ELEMENTS } from '../../constants'

export default function Details() {
	const { id } = useLocalSearchParams()
	const { register, navigateWithTransition } = useDelightfulTransition(`/details/${id}`)

	const item = ELEMENTS?.find(el => el.id.toString() === id)


	return (
		<XScreen {...register}>
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
				<XText
					{...register}
					tag={`title-${id}`}
					style={styles.title}
				>
					{item?.title}
				</XText>

			</XView>

		</XScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// borderWidth: 1,
		// justifyContent: 'center'
	},
	image: {
		width: "100%",
		height: 200
	},
	title: {
		// borderWidth: 1,
		fontSize: 18,
		// fontWeight: "700",
		// color: "#FFF",
		top: -50,
		left: 15
	}
})