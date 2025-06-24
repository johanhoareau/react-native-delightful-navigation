import React from "react"
import type { InProgressXComponentData, TransitionTag } from "../../types/types"

// TODO: add handler error if duplicated tag

export const parseTree = (
	element: React.ReactNode,
	register: InProgressXComponentData[],
	parents: TransitionTag[] = []
): void => {
	if (!React.isValidElement(element)) return

	const { tag } = element.props
	const childrenArray = React.Children.toArray(element.props.children)

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
