import { useEffect, useRef } from "react"
import type {
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
	const transitionStatus = useTransitionStore((state) => state.status)
	const transitionOrigin = useTransitionStore((state) => state.origin?.route)
	const transitionDestination = useTransitionStore(
		(state) => state.destination?.route
	)

	const xComponentRef = useRef(null)

	return {
		xComponentRef,
	}
}
