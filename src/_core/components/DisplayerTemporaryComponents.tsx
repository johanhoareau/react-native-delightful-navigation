import { useEffect } from 'react'
import { useTransitionStore } from '../stores/useTransitionStore'
import { checkIfAllComponentsDataOriginAreSaved } from '../utils/checkIfAllComponentsDataOriginAreSaved'
import { TemporaryImage, TemporaryText, TemporaryView } from './TemporaryTransitionComponents'
import type { XData, XDataInProgress } from '../../types/types'


export const DisplayerTemporaryComponents = () => {
	const componentsForTransition = useTransitionStore(
		(state) => state.origin?.xComponentsData
	)
	const transitionIsEnded = useTransitionStore(state => state.status === "end transition")
	const allComponentsDataOriginAreSaved: boolean = useTransitionStore(
		(state) => {
			// FIXME: handle transition when itemsListToInclude is empty array
			// if (state.origin?.xComponentsData && state.origin?.xComponentsData.length < 1) {
			// 	return true
			// } else {
			const isAllSaved = checkIfAllComponentsDataOriginAreSaved(
				state.origin?.xComponentsData as XData[] | XDataInProgress[] | undefined
			)
			return isAllSaved
			// }
		}
	)
	const isStatusOff = useTransitionStore(state => state.status === "off")
	const setStatusTransition = useTransitionStore(state => state.setStatus)
	const saveHistory = useTransitionStore(state => state.saveHistory)
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
		if (allComponentsDataOriginAreSaved && isStatusOff) {
			console.log("navigate");

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
			saveHistory()
			resetTransitionStore()
			setStatusTransition("off")
		}
	}, [transitionIsEnded])

	return (
		<>
			{allComponentsDataOriginAreSaved ? (
				componentsForTransition?.map((el, index) => {
					const props = { ...el } as XData
					switch (props.type) {
						case "View":
							return (
								<TemporaryView key={index} {...props} />
							)
						case "Text":
							return (
								<TemporaryText key={index} {...props} />
							)
						case "Image":
							return (
								<TemporaryImage key={index} {...props} />
							)
						default:
							return null
					}
				})
			) : null}
		</>
	)
}