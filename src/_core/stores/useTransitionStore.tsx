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
	history: Pick<State, "origin" | "destination">[]
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
			prepareBeforeBack: (navigationCallback: NavigationCallback) => {
				set(
					produce((state: State) => {
						if (!state.origin && !state.destination) {
							// FIXME: select history by comparing with origin-destination navigation
							state.origin = {
								route: state.history[0].destination.route,
								xComponentsData: state.history[0]?.destination?.xComponentsData.map(el => {
									return {
										tag: el.tag,
										parent: ["List"]
									}
								})

							}
							state.destination = {
								route: state.history[0]?.origin.route,
								xComponentsData: []
							}
							state.navigationCallback = navigationCallback
						}
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
