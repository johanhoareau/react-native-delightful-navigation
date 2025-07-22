import { View } from 'react-native'
import React, { useEffect, useState, type PropsWithChildren } from 'react'
import { useTransitionStore } from '../stores/useTransitionStore'
import { useHeaderHeight } from '@react-navigation/elements';
import type { InitialXData, RegisterRef, Route } from '../../types/types';
import { parseTree, type ElementToParseType } from '../utils/parseTree';
import { type NavigationProp, type NavigationState } from '@react-navigation/native';
import type { SharedValue } from 'react-native-reanimated';

type HandlerXScreenStateProps = {
	registerRef: RegisterRef,
	transitionIsFinished: SharedValue<boolean>,
	origin: SharedValue<Route | null>,
	destination: SharedValue<Route | null>,
	navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
		getState(): NavigationState | undefined;
	},
	landmarkRef: React.RefObject<View | null>,
} & PropsWithChildren

// FIXME: call useNavigation here instead pass it by props
export default function HandlerXScreenState({ registerRef, transitionIsFinished, origin, destination, children, landmarkRef, navigation }: HandlerXScreenStateProps) {
	// const navigation = useNavigation()
	const isStatusOnEnd = useTransitionStore(state => state.status === "end transition")
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")
	const originRoute = useTransitionStore(state => state.origin?.route)
	const isOriginRoute = originRoute === registerRef.current.route
	const destinationRoute = useTransitionStore(state => state.destination?.route)
	const isDestinationRoute = destinationRoute === registerRef.current.route
	const navigationCallback = useTransitionStore(state =>
		state.navigationCallback
	)
	const prepareBeforeBack = useTransitionStore(state => state.prepareBeforeBack)
	const headerHeight = useHeaderHeight()

	const [isReadyToMeasureDestinationComponents, setIsReadyToMeasureDestinationComponents] = useState({
		firstHeaderHeightSaved: null as number | null,
		isReady: false
	})

	// Set data for entering animation after transition is finished
	useEffect(() => {
		if (isStatusOnNavigation) {
			origin.value = originRoute ? originRoute : null
			destination.value = destinationRoute ? destinationRoute : null
			transitionIsFinished.value = false
		}
		if (isStatusOnEnd) {
			transitionIsFinished.value = true
		}
	}, [isStatusOnNavigation, isStatusOnEnd])

	// Initialization register
	useEffect(() => {
		const tempRegisterXComponents: InitialXData[] = []
		const childrenArray = React.Children.toArray(children) as ElementToParseType[]
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
							if (!prevState.firstHeaderHeightSaved) {
								return {
									firstHeaderHeightSaved: headerHeight,
									isReady: false
								}
							}
							if (pageY >= prevState.firstHeaderHeightSaved) {

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
		if (!navigation) return
		const unsubscribe = navigation?.addListener('beforeRemove', (e) => {
			e.preventDefault();
			const action = e.data.action;

			if (action.type === 'POP' || action.type === 'GO_BACK') {
				const routes = navigation?.getState()?.routes
				const currentIndex = navigation?.getState()?.index

				if (currentIndex !== undefined) {
					const destinationRoute = routes && routes[currentIndex - 1]
					let routeBack = destinationRoute?.name

					if (destinationRoute?.params) {
						Object.entries(destinationRoute.params).forEach(([key, value]) => {
							routeBack = routeBack?.replace(`[${key}]`, String(value));
						});
					}

					routeBack = routeBack === 'index' ? '/' : `/${routeBack}`

					prepareBeforeBack(
						() => navigation.dispatch(e.data.action),
						registerRef.current.route,
						routeBack
					)
				}
			}

		});

		return unsubscribe;
	}, [navigation])



	return (
		<>
		</>
	)
}