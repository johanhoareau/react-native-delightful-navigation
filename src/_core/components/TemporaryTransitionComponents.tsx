import Animated from "react-native-reanimated"
import withAnimatedTransition from "../hoc/withAnimatedTransition"
import { useTransitionStore } from "../stores/useTransitionStore"
import { checkIfAllComponentsDataOriginAreSaved } from "../utils/checkIfAllComponentsDataOriginAreSaved"
import type { AdditionnalXComponentData, TransitionTag } from "../../types/types"
import { View, type ViewProps } from "react-native"
import { useEffect } from "react"

type ItemProps = AdditionnalXComponentData & { tag: TransitionTag }

const TemporaryView = withAnimatedTransition(Animated.View)

export const Item = ({ type, ...props }: ItemProps) => {

	switch (type) {
		case "View":
			return <TemporaryView {...props} />
		// return <View />
		default:
			return null
	}
}

export const TemporaryTransitionComponents = () => {
	const componentsForTransition = useTransitionStore(
		(state) => state.origin?.xComponentsData
	)
	const transitionIsEnded = useTransitionStore(state => state.status === "end transition")
	const allComponentsDataOriginAreSaved: boolean = useTransitionStore(
		(state) => {
			const isAllSaved = checkIfAllComponentsDataOriginAreSaved(
				state.origin?.xComponentsData
			)
			return isAllSaved
		}
	)
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const resetTransitionStore = useTransitionStore(state => state.resetState)
	const allTransitionIsFinished = useTransitionStore(state => {
		const arrayOfIsTransitionIsFinished = state.destination?.xComponentsData.map(el => el.isTransitionFinished)
		const hasOneLeastNotFinished = arrayOfIsTransitionIsFinished?.includes(false)
		let isAllFinished = hasOneLeastNotFinished !== undefined ? !hasOneLeastNotFinished : false
		if (arrayOfIsTransitionIsFinished?.length === 0) {
			isAllFinished = false
		}
		return isAllFinished
	})

	useEffect(() => {
		if (allComponentsDataOriginAreSaved) {
			setStatusTransition("start transition")
		}

	}, [allComponentsDataOriginAreSaved])

	useEffect(() => {
		if (allTransitionIsFinished) setStatusTransition("end transition")
	}, [allTransitionIsFinished])

	useEffect(() => {
		if (transitionIsEnded) {
			resetTransitionStore()
			setStatusTransition("off")
		}
	}, [transitionIsEnded])

	return (
		<>
			{allComponentsDataOriginAreSaved ? (
				componentsForTransition?.map((el, index) => (
					<Item
						key={index}
						type={el.type}
						tag={el.tag}
						measure={el.measure}
						style={el.style}
					/>
				))
			) : null}
		</>
	)
}
