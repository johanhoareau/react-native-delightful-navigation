import { useEffect, useRef } from "react"
import type {
	NavigateWithTransitionArg,
	NavigationCallback,
	RegisterXComponents,
	Route,
} from "../types/types"
import { useTransitionStore } from "../_core/stores/useTransitionStore"
import { checkIfAllComponentsDataOriginAreSaved } from "../_core/utils/checkIfAllComponentsDataOriginAreSaved"

export const useDelightfulTransition = (route: Route) => {
	const navigationCallbackRef = useRef<NavigationCallback | null>(null)
	const prepareBeforeNavigation = useTransitionStore(
		(state) => state.prepareBeforeNavigation
	)
	const allComponentsDataOriginAreSaved: boolean = useTransitionStore(
		(state) => {
			const isAllSaved = checkIfAllComponentsDataOriginAreSaved(
				state.origin?.xComponentsData
			)
			return isAllSaved
		}
	)

	const registerRef = useRef<RegisterXComponents>({
		route,
		xComponentsData: [],
	})

	const register = {
		registerRef,
	}

	useEffect(() => {
		if (allComponentsDataOriginAreSaved) {
			navigationCallbackRef.current?.()
		}
	}, [allComponentsDataOriginAreSaved])

	const navigateWithTransition = (arg: NavigateWithTransitionArg) => {
		navigationCallbackRef.current = arg.navigationCallback
		prepareBeforeNavigation(registerRef.current, arg.destination)
	}

	return {
		register,
		navigateWithTransition,
	}
}
