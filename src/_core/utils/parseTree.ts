import React, { type PropsWithChildren } from "react"
import type { InitialXData, TransitionTag } from "../../types/types"

// TODO: add handler error if duplicated tag

export type ElementToParseType = React.ReactNode & { props: PropsWithChildren & { tag: TransitionTag } }

export const parseTree = (
	element: ElementToParseType,
	register: InitialXData[],
	parents: TransitionTag[] = []
): void => {
	if (!React.isValidElement(element)) return

	const { tag } = element.props
	const childrenArray = React.Children.toArray(element.props?.children) as ElementToParseType[]

	if (!tag) {
		childrenArray.forEach((el) => parseTree(el, register, parents))
	} else {
		register.push({
			tag,
			parents,
		})
		const newParents = [...parents, tag]
		childrenArray.forEach((el) => parseTree(el, register, newParents))
	}
}
