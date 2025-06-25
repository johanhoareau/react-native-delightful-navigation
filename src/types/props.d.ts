import type { PropsWithChildren } from "react"
import type { RegisterXComponents, TransitionTag } from "./types"

export type FlowManagerProps = {} & PropsWithChildren

export type XComponentProps = {
	registerRef: React.RefObject<RegisterXComponents>
	tag: TransitionTag
}
