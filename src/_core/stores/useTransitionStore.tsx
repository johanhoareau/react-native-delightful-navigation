import { create } from "zustand"
import { combine } from "zustand/middleware"
import type {
	DestinationRegisterXData,
	InitialXData,
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
	origin?: RegisterXData,
	destination?: DestinationRegisterXData,
}

const initialState: State = {
	status: "off",
	origin: undefined,
	destination: undefined,
}

export const useTransitionStore = create(
	combine(
		{ ...initialState },
		(set) => ({
			setStatus: (newStatus: TransitionStatus) => {
				set({ status: newStatus })
			},
			prepareBeforeNavigation: (
				newOrigin: RegisterXData,
				newDestinationRoute: Route
			) => {
				set({
					origin: newOrigin,
					destination: { route: newDestinationRoute, xComponentsData: [] },
				})
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
			resetState: () => {
				set(initialState)
			}
		})
	)
)
