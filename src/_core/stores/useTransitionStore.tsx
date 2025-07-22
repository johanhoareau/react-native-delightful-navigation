import { create } from "zustand"
import { combine } from "zustand/middleware"
import type {
	DestinationRegisterXData,
	InitialRegisterXData,
	InitialXData,
	NavigationCallback,
	RegisterXData,
	Route,
	TransitionStatus,
	TransitionTag,
	XDataToAddToDestination,
	XDataToAddToOrigin,
} from "../../types/types"
import { produce } from "immer"

type State = {
	status: TransitionStatus,
	origin?: RegisterXData | InitialRegisterXData,
	destination?: DestinationRegisterXData,
	navigationCallback: NavigationCallback | null,
	history: Required<Pick<State, "origin" | "destination">>[]
}

const initialState: State = {
	status: "off",
	origin: undefined,
	destination: undefined,
	navigationCallback: null,
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
				navigationCallback: NavigationCallback
			) => {
				set(
					produce((state: State) => {
						if (!state.origin && !state.destination) {
							state.origin = newOrigin
							state.destination = { route: newDestinationRoute, xComponentsData: [] }
							state.navigationCallback = navigationCallback
						}
					})
				)
			},
			prepareBeforeBack: (navigationCallback: NavigationCallback, currentRoute: Route, routeBack: Route) => {
				set(
					produce((state: State) => {
						if (!state.origin && !state.destination) {
							const transitionDataForBack = state.history.find(data => (
								data.origin.route === routeBack && data.destination.route === currentRoute
							))

							if (transitionDataForBack) {
								state.origin = {
									route: transitionDataForBack.destination.route,
									xComponentsData: transitionDataForBack.destination.xComponentsData.map(el => {
										return {
											tag: el.tag,
											parents: ["List"]
										}
									})

								}
								state.destination = {
									route: transitionDataForBack.origin.route,
									xComponentsData: []
								}
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
							const reinitializedDestinationForHistory = state.destination?.xComponentsData.map(el => ({
								...el,
								isTransitionFinished: false
							}))

							state.history = [
								{
									origin: state.origin,
									destination: {
										route: state.destination.route,
										xComponentsData: reinitializedDestinationForHistory
									},
								},
								...state.history,
							]
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
