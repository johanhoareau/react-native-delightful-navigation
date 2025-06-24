import { useEffect, useRef } from "react"
import type {
	MeasuredDimensionsComponent,
	ReactComponent,
	RegisterXComponents,
	Style,
	TransitionTag,
	XComponentType,
} from "../../types/types"
import { useTransitionStore } from "../stores/useTransitionStore"

export const useHandlerXComponent = (
	registerRef: React.RefObject<RegisterXComponents>,
	tag: TransitionTag,
	style: Style,
	type: XComponentType
) => {
	const xComponentRef = useRef<ReactComponent | null>(null)
	const transitionOriginRoute = useTransitionStore(
		(state) => state.origin?.route
	)
	const hasCorrespondenceIntoStoreOrigin = useTransitionStore(
		(state) => !!state.origin?.xComponentsData.find((el) => el.tag === tag)
	)
	const addOriginComponentData = useTransitionStore(
		(state) => state.addOriginComponentData
	)
	// const transitionDestination = useTransitionStore(
	// 	(state) => state.destination?.route
	// )

	// Before navigation
	useEffect(() => {
		const isFromOriginRoute =
			transitionOriginRoute === registerRef.current.route

		if (hasCorrespondenceIntoStoreOrigin && isFromOriginRoute) {
			xComponentRef.current?.measureInWindow((x, y, width, height) => {
				const measurement = {
					height,
					width,
					x,
					y,
				}

				addOriginComponentData({
					tag,
					type,
					style: "test",
					measure: measurement,
				})
			})
		}
	}, [
		hasCorrespondenceIntoStoreOrigin,
		addOriginComponentData,
		registerRef,
		tag,
		transitionOriginRoute,
		type,
	])

	return {
		xComponentRef,
	}
}
