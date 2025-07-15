import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useTransitionStore } from '../stores/useTransitionStore'
import { useHeaderHeight } from '@react-navigation/elements';
import type { InitialXData, RegisterRef } from '../../types/types';
import { parseTree } from '../utils/parseTree';
import { useNavigation, type NavigationProp, type NavigationState } from '@react-navigation/native';

type HandlerXScreenStateProps = {
	registerRef: RegisterRef,
	navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
		getState(): NavigationState | undefined;
	},
}

// FIXME: call useNavigation here instead pass it by props
export default function HandlerXScreenState({ registerRef, children, landmarkRef, navigation }: HandlerXScreenStateProps) {
	// const navigation = useNavigation()
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")
	const isOriginRoute = useTransitionStore(state =>
		state.origin?.route === registerRef.current.route
	)
	const isDestinationRoute = useTransitionStore(state => (
		state.destination?.route === registerRef.current.route
	))
	const navigationCallback = useTransitionStore(state =>
		state.navigationCallback
	)
	const prepareBeforeBack = useTransitionStore(state => state.prepareBeforeBack)
	const headerHeight = useHeaderHeight()

	const [isReadyToMeasureDestinationComponents, setIsReadyToMeasureDestinationComponents] = useState({
		firsHeaderHeightSaved: null,
		isReady: false
	})
	// console.log("RENDER -->> XScreen", registerRef.current.route);

	// Initialization register
	useEffect(() => {
		const tempRegisterXComponents: InitialXData[] = []
		const childrenArray = React.Children.toArray(children)
		childrenArray.forEach((el) => parseTree(el, tempRegisterXComponents))

		// console.log(JSON.stringify(tempRegisterXComponents, null, 2)) // L’arborescence complète ici
		registerRef.current.xComponentsData = tempRegisterXComponents
	}, [children])

	useEffect(() => {
		if (isOriginRoute && isStatusOnNavigation && navigationCallback) {

			navigationCallback()
		}
	}, [navigationCallback, isStatusOnNavigation, isOriginRoute])


	// If destination screen, check when new screen layout is stable to start measurements of destination components
	useEffect(() => {
		if (isDestinationRoute && !headerHeight) {
			console.log("start transition");

			setStatusTransition("start transition")
			return
		}

		let intervalCheckLayout: NodeJS.Timeout | undefined
		if (!isReadyToMeasureDestinationComponents.isReady) {
			if (isDestinationRoute && landmarkRef.current) {
				intervalCheckLayout = setInterval(() => {
					landmarkRef.current?.measure((_, __, ___, ____, _____, pageY) => {
						setIsReadyToMeasureDestinationComponents((prevState) => {
							if (!prevState.firsHeaderHeightSaved) {
								return {
									firsHeaderHeightSaved: headerHeight,
									isReady: false
								}
							}
							if (pageY >= prevState.firsHeaderHeightSaved) {

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
				console.log("start transition -- 2");
				setStatusTransition("start transition")
				clearInterval(intervalCheckLayout)
			}
		}

		return () => clearInterval(intervalCheckLayout)

	}, [isStatusOnNavigation, isReadyToMeasureDestinationComponents, headerHeight])


	// handle navigation back
	useEffect(() => {
		const unsubscribe = navigation?.addListener('beforeRemove', (e) => {
			e.preventDefault();

			prepareBeforeBack(() => {
				navigation.dispatch(e.data.action)

			})
		});

		return unsubscribe;
	}, [navigation])


	return (
		<>
		</>
	)
}

const styles = StyleSheet.create({})