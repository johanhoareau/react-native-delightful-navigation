/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { create } from "zustand"
import { combine } from "zustand/middleware"
import type {
	DestinationRegisterXData,
	InitialRegisterXData,
	InitialXData,
	NavigationCallback,
	RegisterXData,
	Route,
	TransitionConfig,
	TransitionStatus,
	TransitionTag,
	XDataToAddToDestination,
	XDataToAddToOrigin,
} from "../../types/types"
import { produce } from "immer"
import { Easing } from "react-native-reanimated"


type State = {
	status: TransitionStatus,
	origin?: RegisterXData | InitialRegisterXData,
	destination?: DestinationRegisterXData,
	navigationCallback: NavigationCallback | null,
	indexBackTransitionIntoHistory: number | null,
	hasDifferencePosYDetected: {
		difference: number
	} | null,
	config: Required<TransitionConfig>
	history: Required<Pick<State, "origin" | "destination" | "config">>[]
}

const initialState: State = {
	status: "off",
	origin: undefined,
	destination: undefined,
	navigationCallback: null,
	indexBackTransitionIntoHistory: null,
	hasDifferencePosYDetected: null,
	config: {
		duration: 500,
		easing: Easing.inOut(Easing.quad)
	},
	history: []
}


export const useTransitionStore = create(
	combine(
		{ ...initialState },
		(set) => ({
			setStatus: (newStatus: TransitionStatus) => {
				set({ status: newStatus })
			},
			prepareBeforeNavigation: (
				newOrigin: InitialRegisterXData,
				newDestinationRoute: Route,
				navigationCallback: NavigationCallback,
				config?: TransitionConfig
			) => {
				set(
					produce((state: State) => {
						if (!state.origin && !state.destination) {
							state.origin = newOrigin
							state.destination = { route: newDestinationRoute, xComponentsData: [] }
							state.navigationCallback = navigationCallback
							if (config) {
								state.config = { ...state.config, ...config }
							}
						}
					})
				)
			},
			prepareBeforeBack: (navigationCallback: NavigationCallback, currentRoute: Route, routeBack: Route) => {
				set(
					produce((state: State) => {
						if (!state.origin && !state.destination) {

							const transitionDataForBack = state.history.find(data => {
								// console.log("routeBack", routeBack, data.origin.route);
								return (
									data.origin.route === routeBack && data.destination.route === currentRoute
								)
							})
							const indexTransitionDataForBack = state.history.findIndex(data => {
								// console.log("routeBack", routeBack, data.origin.route);
								return (
									data.origin.route === routeBack && data.destination.route === currentRoute
								)
							})

							console.log(JSON.stringify(transitionDataForBack, null, 2));



							if (transitionDataForBack) {
								state.origin = {
									route: transitionDataForBack.destination.route,
									xComponentsData: transitionDataForBack.destination.xComponentsData.map(el => {
										return {
											tag: el.tag,
											parents: []
										}
									})

								}
								state.destination = {
									route: transitionDataForBack.origin.route,
									xComponentsData: []
								}
								state.config = transitionDataForBack.config
								state.indexBackTransitionIntoHistory = indexTransitionDataForBack !== -1 ? indexTransitionDataForBack : null
								// state.status = "navigation"
							} else {
								console.log("navigation without transition");
								state.status = "navigation without transition"
								state.origin = {
									route: currentRoute,
									xComponentsData: []
								}
							}
						}
						state.navigationCallback = navigationCallback
						// console.log(JSON.stringify(state, null, 2));
					})
				)
			},
			addOriginComponentData: (
				componentData: Required<XDataToAddToOrigin>
			) => {
				set(
					produce((state: State) => {
						if (!state.origin) {
							throw new Error("Origin is not initialized")
						}
						const indexComponent = state?.origin?.xComponentsData.findIndex(
							(el: InitialXData) => el.tag === componentData.tag
						)

						if (indexComponent !== -1) {
							state.origin.xComponentsData[indexComponent] = {
								...state.origin.xComponentsData[indexComponent] as InitialXData,
								...componentData,
							}
						}
					})
				)
			},
			addDestinationComponentData: (
				componentData: XDataToAddToDestination
			) => {
				set(
					produce((state: State) => {
						if (!state.destination) {
							throw new Error("Destination is not initialized")
						}
						const isAlreadyAdd = state.destination.xComponentsData.find(
							(el: Omit<InitialXData, "parents">) => el.tag === componentData.tag
						)
						if (!isAlreadyAdd) {
							state.destination.xComponentsData = [
								...state.destination.xComponentsData,
								componentData,
							]
						}
					})
				)
			},
			addBackDestinationComponentData: (tag: TransitionTag) => {
				set(
					produce((state: State) => {
						if (!state.destination) {
							throw new Error("Destination is not initialized")
						}
						const isAlreadyAdd = state.destination.xComponentsData.find(
							(el: Omit<InitialXData, "parents">) => el.tag === tag
						)
						if (!isAlreadyAdd && state.indexBackTransitionIntoHistory !== null) {
							const componentData = state.history[state.indexBackTransitionIntoHistory]?.origin.xComponentsData
								.map(el => ({
									...el,
									isTransitionFinished: false
								})) as XDataToAddToDestination[]

							state.destination.xComponentsData = [
								...state.destination.xComponentsData,
								...componentData,
							]
						}
					})
				)
			},
			setHasDifferencePosYDetected: (difference: number) => {
				set({ hasDifferencePosYDetected: { difference } })
			},
			setTransitionComponentIsFinished: (tag: TransitionTag) => {
				set(
					produce((state: State) => {
						if (!state.destination) {
							throw new Error("Destination is not initialized to start transition")
						}
						const indexDestinationComponent = state.destination.xComponentsData.findIndex(
							(el: Omit<InitialXData, "parents">) => el.tag === tag
						)
						if (
							state.destination.xComponentsData[indexDestinationComponent]
						) {
							state.destination.xComponentsData[indexDestinationComponent].isTransitionFinished = true
						}
					})
				)
			},
			saveHistory: () => {
				set(
					produce((state: State) => {

						if (state.origin && state.destination) {
							if (state.indexBackTransitionIntoHistory === null) {
								state.history = [
									{
										origin: state.origin,
										destination: state.destination,
										config: state.config
									},
									...state.history,
								]
							} else {
								state.history.splice(state.indexBackTransitionIntoHistory)
							}
						}
					}))
			},
			resetState: () => {
				set(state => {
					return {
						...initialState,
						history: state.history
					}
				})
			}
		})
	)
)
