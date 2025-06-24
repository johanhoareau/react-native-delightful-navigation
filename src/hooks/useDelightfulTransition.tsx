import { useEffect, useRef } from "react"
import type {
	NavigateWithTransitionArg,
	NavigationCallback,
	RegisterXComponents,
	Route,
} from "../types/types"
import { useTransitionStore } from "../_core/stores/useTransitionStore"

export const useDelightfulTransition = (route: Route) => {
	const navigationCallbackRef = useRef<NavigationCallback | null>(null)
	// const origin = useTransitionStore((state) => state.origin)
	const destination = useTransitionStore((state) => state.destination)
	const prepareBeforeNavigation = useTransitionStore(
		(state) => state.prepareBeforeNavigation
	)
	const allComponentsDataOriginAreSaved: boolean = useTransitionStore(
		(state) => {
			const arrayOfIsDataSaved = state.origin?.xComponentsData.map(
				(el) => !!el.measure
			)
			const hasLeastOneNotSaved = arrayOfIsDataSaved?.includes(false)
			const isAllSaved =
				hasLeastOneNotSaved !== undefined ? !hasLeastOneNotSaved : false
			return isAllSaved
		}
	)
	console.log("DESTINATION --->> ", JSON.stringify(destination, null, 2))

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
