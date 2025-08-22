/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { useEffect } from "react"
import { useTransitionStore } from "../stores/useTransitionStore"

type Props = {}

const HandlerOriginTransitionEffect = ({ }: Props) => {
	const isStatusOnNavigation = useTransitionStore(state => state.status === "navigation")
	const isStatusOnNavigationWithoutTransition = useTransitionStore(state => state.status === "navigation without transition")
	const navigationCallback = useTransitionStore(state =>
		state.navigationCallback
	)
	const resetTransitionStore = useTransitionStore(state => state.resetState)


	useEffect(() => {
		const isReadyToNavigateWithTransition = !!navigationCallback && !!isStatusOnNavigation
		if (isReadyToNavigateWithTransition) {
			navigationCallback()
		}
	}, [navigationCallback, isStatusOnNavigation, isStatusOnNavigationWithoutTransition])

	useEffect(() => {
		const isReadyToNavigateWithoutTransition = isStatusOnNavigationWithoutTransition && navigationCallback
		if (isReadyToNavigateWithoutTransition) {
			navigationCallback()
			resetTransitionStore()
		}
	}, [isStatusOnNavigationWithoutTransition, navigationCallback])

	return (
		<></>
	)
}

export default HandlerOriginTransitionEffect