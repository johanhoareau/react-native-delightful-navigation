import type { RegisterXComponents, TransitionTag } from "./types"

export type XComponentProps = {
	registerRef: React.RefObject<RegisterXComponents>
	tag: TransitionTag
}
