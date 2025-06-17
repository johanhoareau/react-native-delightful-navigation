import { create } from "zustand"
import { combine } from "zustand/middleware"
import type { TransitionStatus } from "../../types/types"

export const useTransitionStore = create(
	combine(
		{
			status: "off" as TransitionStatus,
			origin: null,
			destination: null,
		},
		(set) => ({
			setStatus: (newStatus: TransitionStatus) => {
				set({ status: newStatus })
			},
		})
	)
)
