import type { PropsWithChildren } from "react"
import type { RegisterRef, RegisterXComponents, TransitionTag } from "./types"

export type FlowManagerProps = {} & PropsWithChildren

export type XComponentProps = {
	registerRef: RegisterRef
	tag: TransitionTag
}
