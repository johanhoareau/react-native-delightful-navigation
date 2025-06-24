import { useRef, useState } from "react"
import type {
	NavigationCallback,
	NavigationWithTransitionArg,
	RegisterXComponents,
	Route,
} from "../types/types"

export const useDelightfulTransition = (route: Route) => {
	const navigationCallbackRef = useRef<NavigationCallback | null>(null)

	const registerRef = useRef<RegisterXComponents>({
		route,
		xComponentsData: [],
	})

	const register = {
		registerRef,
	}

	const navigationWithTransition = (arg: NavigationWithTransitionArg) => {
		navigationCallbackRef.current = arg.navigationCallback
	}

	return {
		register,
	}
}
