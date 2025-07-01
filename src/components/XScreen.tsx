import React, { useEffect, useRef, useState, type PropsWithChildren } from "react"
import { StyleSheet, View } from "react-native"
import { useHeaderHeight } from '@react-navigation/elements';
import type {
	InProgressXComponentData,
	RegisterRef,
} from "../types/types"
import { parseTree } from "../_core/utils/parseTree"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useTransitionStore } from "../_core/stores/useTransitionStore";

type XScreenProps = {
	registerRef: RegisterRef
} & PropsWithChildren

export const XScreen = ({ registerRef, children }: XScreenProps) => {
	const status = useTransitionStore(state => state.status)
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")
	const headerHeight = useHeaderHeight()
	const landmarkRef = useRef<View | null>(null)

	const [isReadyToMeasureDestinationComponents, setIsReadyToMeasureDestinationComponents] = useState(false)


	// Initialization register
	useEffect(() => {
		const tempRegisterXComponents: InProgressXComponentData[] = []
		const childrenArray = React.Children.toArray(children)
		childrenArray.forEach((el) => parseTree(el, tempRegisterXComponents))

		// console.log(JSON.stringify(tempRegisterXComponents, null, 2)) // L’arborescence complète ici
		registerRef.current.xComponentsData = tempRegisterXComponents
	}, [children])

	// Launch measurements of destination components when new screen layout is stable
	useEffect(() => {
		let intervalCheckLayout: NodeJS.Timeout
		if (!isReadyToMeasureDestinationComponents) {
			if (landmarkRef.current && registerRef.current.route === "/details") {
				console.log("STATUS ---->>", status);

				intervalCheckLayout = setInterval(() => {
					landmarkRef.current?.measure((x, y, width, height, pageX, pageY) => {
						if (pageY >= headerHeight) {
							setIsReadyToMeasureDestinationComponents((prevState) => !prevState && true)
						}
					})

				}, 16.67)
			}
		} else {
			if (status === "navigation") {
				console.log("FINISHED");
				setStatusTransition("start transition")
				clearInterval(intervalCheckLayout)
			}
		}
		return () => clearInterval(intervalCheckLayout)
	}, [isStatusOnNavigation, isReadyToMeasureDestinationComponents])


	return (
		<>
			<Animated.View ref={landmarkRef} />
			{children}
		</>
	)
}

const styles = StyleSheet.create({})
