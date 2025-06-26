import { create } from "zustand"
import { combine } from "zustand/middleware"
import type {
	AdditionnalXComponentData,
	DestinationRegisterXComponents,
	RegisterXComponents,
	Route,
	TransitionFinished,
	TransitionStatus,
	TransitionTag,
	XComponentData,
} from "../../types/types"
import { produce } from "immer"

const initialState =
{
	status: "off" as TransitionStatus,
	origin: null as RegisterXComponents | null,
	destination: null as DestinationRegisterXComponents | null,
}

export const useTransitionStore = create(
	combine(
		{ ...initialState },
		(set) => ({
			setStatus: (newStatus: TransitionStatus) => {
				set({ status: newStatus })
			},
			prepareBeforeNavigation: (
				newOrigin: RegisterXComponents,
				newDestinationRoute: Route
			) => {
				set({
					origin: newOrigin,
					destination: { route: newDestinationRoute, xComponentsData: [] },
				})
			},
			addOriginComponentData: (
				componentData: AdditionnalXComponentData & { tag: TransitionTag }
			) => {
				set(
					produce((state) => {
						const indexComponent = state.origin.xComponentsData.findIndex(
							(el: XComponentData) => el.tag === componentData.tag
						)
						if (indexComponent !== -1) {
							state.origin.xComponentsData[indexComponent] = {
								...state.origin.xComponentsData[indexComponent],
								...componentData,
							}
						}
					})
				)
			},
			addDestinationComponentData: (
				componentData: AdditionnalXComponentData & { tag: TransitionTag } & TransitionFinished
			) => {
				set(
					produce((state) => {
						const isAlreadyAdd = state.destination.xComponentsData.find(
							(el: XComponentData) => el.tag === componentData.tag
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
					produce(state => {
						const indexDestinationComponent = state.destination.xComponentsData.findIndex(
							(el: XComponentData & TransitionFinished) => el.tag === tag
						)
						state.destination.xComponentsData[indexDestinationComponent].isTransitionFinished = true
					})
				)
			},
			resetState: () => {
				set(initialState)
			}
		})
	)
)
