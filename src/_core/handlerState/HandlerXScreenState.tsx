/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import React, { useEffect, type PropsWithChildren } from 'react'
import { useTransitionStore } from '../stores/useTransitionStore'
import type { InitialXData, RegisterRef, Route } from '../../types/types';
import { parseTree, type ElementToParseType } from '../utils/parseTree';
import { type NavigationProp, type NavigationState } from '@react-navigation/native';
import { type AnimatedRef, type SharedValue } from 'react-native-reanimated';
import HandlerOriginTransitionEffect from './HandlerOriginTransitionEffect';
import HandlerDestinationTransitionEffect from './HandlerDestinationTransitionEffect';

type HandlerXScreenStateProps = {
	registerRef: RegisterRef,
	transitionIsFinished: SharedValue<boolean>,
	origin: SharedValue<Route | null>,
	navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
		getState(): NavigationState | undefined;
	},
	landmarkRef: AnimatedRef<React.Component<{}, {}, any>>,
} & PropsWithChildren

// FIXME: call useNavigation here instead pass it by props
export default function HandlerXScreenState({ registerRef, transitionIsFinished, origin, children, landmarkRef, navigation }: HandlerXScreenStateProps) {
	// const navigation = useNavigation()
	const originRoute = useTransitionStore(state => state.origin?.route)
	const isOriginRoute = originRoute === registerRef?.current.route
	const destinationRoute = useTransitionStore(state => state.destination?.route)
	const isDestinationRoute = destinationRoute === registerRef?.current.route
	const prepareBeforeBack = useTransitionStore(state => state.prepareBeforeBack)


	// Initialization register
	useEffect(() => {
		if (!registerRef.current) return
		const tempRegisterXComponents: InitialXData[] = []
		const childrenArray = React.Children.toArray(children) as ElementToParseType[]
		childrenArray.forEach((el) => parseTree(el, tempRegisterXComponents))

		// console.log(JSON.stringify(tempRegisterXComponents, null, 2)) // L’arborescence complète ici
		registerRef.current.xComponentsData = tempRegisterXComponents
	}, [children])


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
					// console.log(JSON.stringify(navigation?.getParent()?.getState(), null, 2));


					if (!routeBack) {
						throw new Error("route back is undefined")
					} else {
						let routeBackSplitted: string | string[] = routeBack.split("/")

						if (routeBackSplitted?.reverse()[0] === "index") {
							const formattedRouteBack = routeBackSplitted = routeBackSplitted.length > 1 ? routeBackSplitted.splice(-1).join("/") : ""
							routeBack = formattedRouteBack
						}


						if (destinationRoute?.params) {
							Object.entries(destinationRoute.params).forEach(([key, value]) => {
								routeBack = routeBack?.replace(`[${key}]`, String(value));
							});
						}


						// FIXME: find a safer way to to get completed back route path
						const parent = navigation?.getParent()?.getState().routes[1] ? navigation?.getParent()?.getState().routes[1]?.name : ""

						routeBack = "/" + parent + routeBack


						prepareBeforeBack(
							() => navigation.dispatch(e.data.action),
							registerRef.current.route,
							routeBack
						)
					}
				}
			}

		});

		return unsubscribe;
	}, [navigation])



	return (
		<>
			{isOriginRoute ? (
				<HandlerOriginTransitionEffect />
			) : null}
			{isDestinationRoute ? (
				<HandlerDestinationTransitionEffect
					landmarkRef={landmarkRef}
					transitionIsFinished={transitionIsFinished}
					origin={origin}
				/>
			) : null}
		</>
	)
}