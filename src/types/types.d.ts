import type { Image, ImageSourcePropType, ImageStyle, Text, TextStyle, View, ViewStyle } from "react-native"

export type TransitionStatus =
	| "off"
	| "navigation without transition"
	| "navigation"
	| "start transition"
	| "end transition"
	| "cleaning"

export type Route = string
export type TransitionTag = string
export type XComponentType = "View" | "Text" | "Image"
export type Style = StyleProp<ViewStyle | TextStyle | ImageStyle>
export type ReactComponent = View | Text | Image
export type RegisterRef = React.RefObject<RegisterXComponents>
export type IsTransitionFinished = { isTransitionFinished: boolean }

export type MeasuredDimensionsComponent = {
	x: number;
	y: number;
	width: number;
	height: number;
}

export type InitialXData = {
	tag: TransitionTag,
	parents: TransitionTag[],
}

export type CommonXData = InitialXData & { measure?: MeasuredDimensionsComponent }

export type XViewData = CommonXData & { type: "View", style: StyleProp<ViewStyle> }
export type XTextData = CommonXData & { type: "Text", style: StyleProp<TextStyle>, text?: string }
export type XImageData = CommonXData & { type: "Image", style: StyleProp<ImageStyle>, source: ImageSourcePropType }

export type XDataInProgress = XViewData | XTextData | XImageData

export type XDataToAddToOrigin =
	Omit<XViewData, "parents">
	| Omit<XTextData, "parents">
	| Omit<XImageData, "parents">

export type XDataToAddToDestination =
	Omit<XViewData, "parents"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>
	| Omit<XTextData, "parents" | "text"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>
	| Omit<XImageData, "parents" | "source"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>

export type XData = XDataInProgress & Required<{ measure: MeasuredDimensionsComponent }>

export type DestinationXData =
	Omit<XViewData, "parents"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>
	| Omit<XTextData, "parents" | "text"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>
	| Omit<XImageData, "parents" | "source"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>

export type InitialRegisterXData = {
	route: Route,
	xComponentsData: [] | InitialXData[]
}

export type RegisterXData = {
	route: Route,
	xComponentsData: [] | XData[]
}

export type DestinationRegisterXData = {
	route: Route,
	xComponentsData: [] | DestinationXData[]
}

export type NavigationCallback = () => void

export type NavigateWithTransitionArg = {
	destination: Route,
	navigationCallback: NavigationCallback
	includes?: TransitionTag[],
	excludes?: TransitionTag[],
	itemsListToInclude?: TransitionTag[],
}
