import type { Image, ImageStyle, Text, TextStyle, View, ViewStyle } from "react-native"

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
export type XComponentType = "View" | "Text"
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

// export type DestXViewData = Omit<XViewData, "parents"> & IsTransitionFinished
// export type DestXTextData = Omit<XTextData, "parents"> & IsTransitionFinished

export type XDataInProgress = XViewData | XTextData

export type XDataToAddToOrigin =
	Omit<XViewData, "parents">
	| Omit<XTextData, "parents">

export type XDataToAddToDestination =
	Omit<XViewData, "parents"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>
	| Omit<XTextData, "parents"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>

export type XData = XDataInProgress & Required<{ measure: MeasuredDimensionsComponent }>
export type DestinationXData =
	Omit<XViewData, "parents"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>
	| Omit<XTextData, "parents"> & IsTransitionFinished & Required<{ measure: MeasuredDimensionsComponent }>

export type RegisterXData = {
	route: Route,
	xComponentsData: [] | XData[]
}

export type DestinationRegisterXData = {
	route: Route,
	xComponentsData: [] | DestinationXData[]
}

// 
// export type InitialXComponentData = {
// 	tag: TransitionTag,
// 	parents: TransitionTag[],
// }

// export type AdditionnalXComponentData = {
// 	type?: XComponentType,
// 	measure: MeasuredDimensionsComponent,
// 	style: Style
// }

// export type XComponentData = InitialXComponentData & AdditionnalXComponentData
// export type InProgressXComponentData = InitialXComponentData & Partial<AdditionnalXComponentData>
// export type DestinationData = InProgressXComponentData & TransitionFinished

// export type RegisterXComponents = {
// 	route: Route
// 	xComponentsData: InProgressXComponentData[]
// }

// export type DestinationRegisterXComponents = {
// 	route: Route
// 	xComponentsData: DestinationData[]
// }

// export type StoreRegisterXComponents = {
// 	route: Route,
// 	xComponentsData: XComponentData
// }

export type NavigationCallback = () => void

export type NavigateWithTransitionArg = {
	destination: Route,
	navigationCallback: NavigationCallback
}
