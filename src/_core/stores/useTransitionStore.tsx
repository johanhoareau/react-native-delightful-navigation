import { create } from "zustand"
import { combine } from "zustand/middleware"
import type {
	AdditionnalXComponentData,
	RegisterXComponents,
	Route,
	TransitionStatus,
	TransitionTag,
	XComponentData,
} from "../../types/types"
import { produce } from "immer"

export const useTransitionStore = create(
	combine(
		{
			status: "off" as TransitionStatus,
			origin: null as RegisterXComponents | null,
			destination: null as RegisterXComponents | null,
		},
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
		})
	)
)
