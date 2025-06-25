import Animated from "react-native-reanimated"
import withAnimatedTransition from "../hoc/withAnimatedTransition"
import { useTransitionStore } from "../stores/useTransitionStore"
import { checkIfAllComponentsDataOriginAreSaved } from "../utils/checkIfAllComponentsDataOriginAreSaved"
import type { AdditionnalXComponentData, TransitionTag } from "../../types/types"
import { View, type ViewProps } from "react-native"

type ItemProps = AdditionnalXComponentData & { tag: TransitionTag } & ViewProps

const TemporaryView = withAnimatedTransition(Animated.View)

export const Item = ({ type, ...props }: ItemProps) => {
	console.log(type);

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
	const allComponentsDataOriginAreSaved: boolean = useTransitionStore(
		(state) => {
			const isAllSaved = checkIfAllComponentsDataOriginAreSaved(
				state.origin?.xComponentsData
			)
			return isAllSaved
		}
	)
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
