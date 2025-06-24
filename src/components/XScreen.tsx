import React, { useEffect, type PropsWithChildren } from "react"
import { StyleSheet } from "react-native"
import type {
	InProgressXComponentData,
	RegisterXComponents,
} from "../types/types"
import { parseTree } from "../_core/utils/parseTree"

type XScreenProps = {
	registerRef: React.RefObject<RegisterXComponents>
} & PropsWithChildren

export const XScreen = ({ registerRef, children }: XScreenProps) => {
	useEffect(() => {
		const tempRegisterXComponents: InProgressXComponentData[] = []
		const childrenArray = React.Children.toArray(children)
		childrenArray.forEach((el) => parseTree(el, tempRegisterXComponents))

		// console.log(JSON.stringify(tempRegisterXComponents, null, 2)) // L’arborescence complète ici
		registerRef.current.xComponentsData = tempRegisterXComponents
	}, [children])

	return <>{children}</>
}

const styles = StyleSheet.create({})
