import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useTransitionStore } from '../stores/useTransitionStore'
import { checkIfAllComponentsDataOriginAreSaved } from '../utils/checkIfAllComponentsDataOriginAreSaved'
import type { XData } from '../../types/types'
import { TemporaryText, TemporaryView } from './TemporaryTransitionComponents'


type ItemProps = XData & { text?: string }

export const Item = ({ type, ...props }: ItemProps) => {

	switch (type) {
		case "View":
			return (
				<TemporaryView {...props} />
			)
		case "Text":
			return (
				<TemporaryText {...props} />
			)
		default:
			return null
	}
}

export const DisplayerTemporaryComponents = () => {
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
			setStatusTransition("navigation")
		}

	}, [allComponentsDataOriginAreSaved])

	useEffect(() => {

		if (allTransitionIsFinished) {
			console.log("END");
			setStatusTransition("end transition")
		}
	}, [allTransitionIsFinished])

	useEffect(() => {
		if (transitionIsEnded) {
			console.log("OFF");
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
						parents={el.parents}
						tag={el.tag}
						measure={el.measure}
						style={el.style}
						text={el.type === "Text" ? el?.text : ""}
					/>
				))
			) : null}
		</>
	)
}