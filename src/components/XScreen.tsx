import React, { useEffect, type PropsWithChildren } from "react"
import { StyleSheet, View } from "react-native"
import { useHeaderHeight } from '@react-navigation/elements';
import type {
	InProgressXComponentData,
	RegisterRef,
	RegisterXComponents,
} from "../types/types"
import { parseTree } from "../_core/utils/parseTree"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type XScreenProps = {
	registerRef: RegisterRef
} & PropsWithChildren

export const XScreen = ({ registerRef, children }: XScreenProps) => {
	const headerHeight = useHeaderHeight()
	const headerCloneHeight = useSharedValue(headerHeight)


	useEffect(() => {
		headerCloneHeight.value = withTiming(0, { duration: 10 })
	}, [])

	const headerCloneAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: headerCloneHeight.value
		}
	})

	useEffect(() => {
		const tempRegisterXComponents: InProgressXComponentData[] = []
		const childrenArray = React.Children.toArray(children)
		childrenArray.forEach((el) => parseTree(el, tempRegisterXComponents))

		// console.log(JSON.stringify(tempRegisterXComponents, null, 2)) // L’arborescence complète ici
		registerRef.current.xComponentsData = tempRegisterXComponents
	}, [children])

	return (
		<>
			<Animated.View
				style={[
					{ width: '100%' },
					headerCloneAnimatedStyle
				]}
			/>
			{children}
		</>
	)
}

const styles = StyleSheet.create({})
