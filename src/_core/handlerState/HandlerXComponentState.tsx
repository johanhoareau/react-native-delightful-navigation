import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import type { ReactComponent, RegisterRef, Style, TransitionTag, XComponentType } from '../../types/types'
import { useTransitionStore } from '../stores/useTransitionStore'

type HandlerXComponentStateProps = {
	setOpacityDuringTransition: (opacity: { opacity?: number }) => void,
	registerRef: RegisterRef
	tag: TransitionTag,
	style: Style
	type: XComponentType,
	xComponentRef: React.RefObject<ReactComponent | null>
	source?: number,
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

	// if (tag === "button2" && registerRef.current.route === "/") {
	// 	const dataLog = {
	// 		tag,
	// 		route: registerRef.current.route,
	// 		statusTransition
	// 	}
	// 	console.log("RENDER", JSON.stringify(dataLog, null, 2))
	// }

	useEffect(() => {
		if ((
			statusTransition === "navigation" || statusTransition === "start transition")
			&& (hasCorrespondenceIntoStoreOrigin || transitionDestinationRoute === registerRef.current.route)
		) {
			setOpacityDuringTransition({ opacity: 0 })
		} else {
			setOpacityDuringTransition({})
		}
	}, [statusTransition])

	// Before navigation
	useEffect(() => {
		const isFromOriginRoute =
			transitionOriginRoute === registerRef.current.route

		if (hasCorrespondenceIntoStoreOrigin && isFromOriginRoute) {
			xComponentRef.current?.measure((_, __, width, height, pageX, pageY) => {
				const measurement = {
					height,
					width,
					x: pageX,
					y: pageY,
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
			transitionDestinationRoute === registerRef.current.route

		if (hasCorrespondenceIntoStoreOrigin && isFromDestinationRoute && statusTransition === "start transition") {

			xComponentRef.current?.measure((_, __, width, height, pageX, pageY) => {
				const measurement = {
					height,
					width,
					x: pageX,
					y: pageY,
				}

				addDestinationComponentData({
					tag,
					type,
					style,
					measure: measurement,
					isTransitionFinished: false
				})
			})
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

const styles = StyleSheet.create({})