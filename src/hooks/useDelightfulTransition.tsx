import { useEffect, useRef } from "react"
import type {
	NavigateWithTransitionArg,
	NavigationCallback,
	RegisterXData,
	Route,
	XData,
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
		let newData: XData[] = []
		if (arg.includes && arg.includes?.length > 0) {
			arg.includes.forEach(tag => {
				const dataFund = registerRef.current.xComponentsData.filter(el => el.tag === tag)
				if (dataFund) {
					newData = [...newData, ...dataFund]
				}
			})
		} else if (arg.excludes && arg.excludes?.length > 0) {
			let dataFiltered = [...registerRef.current.xComponentsData]
			arg.excludes.forEach(tag => {
				dataFiltered = dataFiltered.filter(el => el.tag !== tag)
			})
			newData = [...dataFiltered]
		} else {
			console.log("HERERE");

			newData = [...registerRef.current.xComponentsData]
		}

		console.log("newData", newData);


		prepareBeforeNavigation({
			route: registerRef.current.route,
			xComponentsData: newData
		}, arg.destination)
	}

	return {
		register,
		navigateWithTransition,
	}
}
