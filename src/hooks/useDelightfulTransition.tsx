import { useEffect, useRef } from "react"
import type {
	NavigateWithTransitionArg,
	NavigationCallback,
	RegisterXData,
	Route,
} from "../types/types"
import { useTransitionStore } from "../_core/stores/useTransitionStore"


export const useDelightfulTransition = (route: Route) => {
	const navigationCallbackRef = useRef<NavigationCallback | null>(null)
	const prepareBeforeNavigation = useTransitionStore(
		(state) => state.prepareBeforeNavigation
	)
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")


	const registerRef = useRef<RegisterXData>({
		route,
		xComponentsData: [],
	})

	const register = {
		registerRef,
	}

	useEffect(() => {
		if (isStatusOnNavigation) {
			navigationCallbackRef.current?.()
		}
	}, [isStatusOnNavigation])


	const navigateWithTransition = (arg: NavigateWithTransitionArg) => {
		navigationCallbackRef.current = arg.navigationCallback
		prepareBeforeNavigation(registerRef.current, arg.destination)
	}

	return {
		register,
		navigateWithTransition,
	}
}
