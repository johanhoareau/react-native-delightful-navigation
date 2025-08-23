/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import React, { useEffect, useState } from 'react'
import type { ReactComponent, RegisterRef, Style, TransitionTag, XComponentType } from '../../types/types'
import { useTransitionStore } from '../stores/useTransitionStore'
import type { ImageURISource } from 'react-native'

type HandlerXComponentStateProps = {
	setOpacityDuringTransition: (opacity: { opacity?: number }) => void,
	registerRef: RegisterRef
	tag: TransitionTag,
	style: Style
	type: XComponentType,
	xComponentRef: React.RefObject<ReactComponent | null>
	source?: number | ImageURISource | ImageURISource[],
	text?: string
}

export const HandlerXComponentState = ({
	setOpacityDuringTransition,
	registerRef,
	style,
	tag,
	type,
	xComponentRef,
	source,
	text
}: HandlerXComponentStateProps) => {

	const statusTransition = useTransitionStore(state => state.status)
	const transitionOriginRoute = useTransitionStore(
		(state) => state.origin?.route
	)
	const transitionDestinationRoute = useTransitionStore(
		(state) => state.destination?.route
	)
	const hasCorrespondenceIntoStoreOrigin = useTransitionStore(
		(state) => !!state.origin?.xComponentsData.find((el) => el.tag === tag)
	)
	const addOriginComponentData = useTransitionStore(
		(state) => state.addOriginComponentData
	)
	const addDestinationComponentData = useTransitionStore(
		(state) => state.addDestinationComponentData
	)
	const hasDifferencePosYDetected = useTransitionStore(
		(state) => state.hasDifferencePosYDetected
	)
	const indexBackTransitionIntoHistory = useTransitionStore(
		(state) => state.indexBackTransitionIntoHistory
	)
	const addBackDestinationComponentData = useTransitionStore(
		(state) => state.addBackDestinationComponentData
	)
	const [hasDetectionPositionYProblem, setHasDetectionPositionYProblem] = useState<{ difference: number } | null>(null)


	useEffect(() => {
		if (
			(statusTransition === "navigation" || statusTransition === "start transition")
			&& hasCorrespondenceIntoStoreOrigin
		) {
			setOpacityDuringTransition({ opacity: 0 })
		} else {
			setOpacityDuringTransition({})
		}
	}, [statusTransition])

	// Before navigation
	useEffect(() => {
		const isFromOriginRoute =
			transitionOriginRoute === registerRef?.current.route

		if (hasCorrespondenceIntoStoreOrigin && isFromOriginRoute) {
			xComponentRef.current?.measure((_, __, width, height, pageX, pageY) => {
				const measurement = {
					height,
					width,
					x: pageX,
					y: hasDetectionPositionYProblem
						? pageY + hasDetectionPositionYProblem.difference
						: pageY
					,
				}

				if (type === "View") {
					addOriginComponentData({
						tag,
						type,
						style,
						measure: measurement,
					})
				} else if (type === "Text") {

					if (typeof text === "string") {
						addOriginComponentData({
							tag,
							type,
							style,
							text,
							measure: measurement,
						})
					}
				} else if (type === "Image") {

					if (source) {
						addOriginComponentData({
							tag,
							type,
							style,
							source,
							measure: measurement,
						})
					}
				}
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

	// During navigation
	useEffect(() => {
		const isFromDestinationRoute =
			transitionDestinationRoute === registerRef?.current.route

		if (hasCorrespondenceIntoStoreOrigin && isFromDestinationRoute && statusTransition === "start transition") {
			if (indexBackTransitionIntoHistory !== null) {
				console.log("BACK TEST");

				addBackDestinationComponentData(tag)
			} else {
				xComponentRef.current?.measure((_, __, width, height, pageX, pageY) => {
					const measurement = {
						height,
						width,
						x: pageX,
						y: hasDifferencePosYDetected
							? pageY + hasDifferencePosYDetected.difference
							: pageY
						,
					}

					addDestinationComponentData({
						tag,
						type,
						style,
						measure: measurement,
						isTransitionFinished: false
					})
					hasDifferencePosYDetected && setHasDetectionPositionYProblem({ difference: hasDifferencePosYDetected.difference })
				})
			}
		}
	}, [
		addDestinationComponentData,
		hasCorrespondenceIntoStoreOrigin,
		registerRef,
		style,
		tag,
		transitionDestinationRoute,
		type,
		statusTransition
	])


	return (
		<>
		</>
	)
}