import { useRef } from "react"
import type {
	InitialXData,
	NavigateWithTransitionArg,
	RegisterXData,
	Route,
} from "../types/types"
import { useTransitionStore } from "../_core/stores/useTransitionStore"
import { useSharedValue } from "react-native-reanimated"


export const useDelightfulTransition = (route: Route) => {
	const prepareBeforeNavigation = useTransitionStore(
		(state) => state.prepareBeforeNavigation
	)

	const transitionIsFinished = useSharedValue(true)
	const origin = useSharedValue<Route | null>(null)

	const registerRef = useRef<RegisterXData>({
		route,
		xComponentsData: [],
	})

	const register = {
		registerRef,
		transitionIsFinished,
		origin
	}


	// FIXME: handle double click
	const navigateWithTransition = (arg: NavigateWithTransitionArg) => {
		console.log("click")

		let tempData = [...registerRef.current.xComponentsData] as InitialXData[]

		let newData: InitialXData[] = []
		if (arg.includes && arg.includes?.length > 0) {
			arg.includes.forEach(tag => {
				const dataFund = tempData.filter(el => el.tag === tag)
				if (dataFund) {
					newData = [...newData, ...dataFund]
				}
			})
		} else if (arg.excludes && arg.excludes?.length > 0) {
			let dataFiltered = [...tempData]
			arg.excludes.forEach(tag => {
				dataFiltered = dataFiltered.filter(el => el.tag !== tag)
			})
			newData = [...dataFiltered]
		} else {

			newData = [...tempData]
		}

		if (arg.itemsListToInclude && arg.itemsListToInclude.length > 0) {
			if (newData.length === tempData.length) {
				newData = []
			}
			arg.itemsListToInclude.forEach(tag => {
				newData = [
					...newData,
					{
						tag,
						parents: ["List"]
					}
				]
			})
		}



		prepareBeforeNavigation(
			{
				route: registerRef.current.route,
				xComponentsData: newData
			},
			arg.destination,
			arg.navigationCallback,
			arg.options ? arg.options : undefined
		)
	}

	return {
		register,
		navigateWithTransition,
		transitionIsFinished,
		origin,
	}
}
