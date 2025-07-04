import React, { useEffect, useRef, useState, type PropsWithChildren } from "react"
import { View } from "react-native"
import { useHeaderHeight } from '@react-navigation/elements';
import type {
	InitialXData,
	// InProgressXComponentData,
	RegisterRef,
} from "../types/types"
import { parseTree } from "../_core/utils/parseTree"
import Animated from "react-native-reanimated";
import { useTransitionStore } from "../_core/stores/useTransitionStore";

type XScreenProps = {
	registerRef: RegisterRef
} & PropsWithChildren

export const XScreen = ({ registerRef, children }: XScreenProps) => {
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")
	const isDestinationRoute = useTransitionStore(state => (
		state.destination?.route === registerRef.current.route
	))
	const headerHeight = useHeaderHeight()
	const landmarkRef = useRef<View | null>(null)

	const [isReadyToMeasureDestinationComponents, setIsReadyToMeasureDestinationComponents] = useState({
		firsHeaderHightSaved: null,
		isReady: false
	})



	// Initialization register
	useEffect(() => {
		const tempRegisterXComponents: InitialXData[] = []
		const childrenArray = React.Children.toArray(children)
		childrenArray.forEach((el) => parseTree(el, tempRegisterXComponents))

		// console.log(JSON.stringify(tempRegisterXComponents, null, 2)) // L’arborescence complète ici
		registerRef.current.xComponentsData = tempRegisterXComponents
	}, [children])


	// If destination screen, check when new screen layout is stable to start measurements of destination components
	useEffect(() => {
		if (isDestinationRoute && !headerHeight) {
			setStatusTransition("start transition")
			return
		}

		let intervalCheckLayout: NodeJS.Timeout | undefined
		if (!isReadyToMeasureDestinationComponents.isReady) {
			if (isDestinationRoute && landmarkRef.current) {
				intervalCheckLayout = setInterval(() => {
					landmarkRef.current?.measure((_, __, ___, ____, _____, pageY) => {
						setIsReadyToMeasureDestinationComponents((prevState) => {
							if (!prevState.firsHeaderHightSaved) {
								return {
									firsHeaderHightSaved: headerHeight,
									isReady: false
								}
							}
							if (pageY >= prevState.firsHeaderHightSaved) {
								return {
									...prevState,
									isReady: true
								}

							}
							return prevState
						})
					})

				}, 16.67)
			}
		} else {
			if (isStatusOnNavigation) {
				setStatusTransition("start transition")
				clearInterval(intervalCheckLayout)
			}
		}

		return () => clearInterval(intervalCheckLayout)

	}, [isStatusOnNavigation, isReadyToMeasureDestinationComponents, headerHeight])


	return (
		<>
			<Animated.View ref={landmarkRef} />
			{children}
		</>
	)
}
