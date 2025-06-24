import type { Image, Text, View } from "react-native"

export type TransitionStatus =
	| "off"
	| "before navigation"
	| "navigation"
	| "before transition"
	| "start transition"
	| "end transition"
	| "cleaning"

export type Route = string
export type TransitionTag = string
export type XComponentType = "View" | "Text" | "Image"
export type Style = StyleProp<ViewStyle | TextStyle | ImageStyle>
export type ReactComponent = View | Text | Image

export type MeasuredDimensionsComponent = {
	x: number;
	y: number;
	width: number;
	height: number;
}

export type InitialXComponentData = {
	tag: TransitionTag,
	parents: TransitionTag[],
}

export type AdditionnalXComponentData = {
	type: XComponentType,
	measure: MeasuredDimensionsComponent,
	style: Style
}

export type XComponentData = InitialXComponentData & AdditionnalXComponentData
export type InProgressXComponentData = InitialXComponentData & Partial<AdditionnalXComponentData>

export type RegisterXComponents = {
	route: Route
	xComponentsData: InProgressXComponentData[]
}

export type StoreRegisterXComponents = {
	route: Route,
	xComponentsData: XComponentData
}

export type NavigationCallback = () => void

export type NavigateWithTransitionArg = {
	destination: Route,
	navigationCallback: NavigationCallback
}
