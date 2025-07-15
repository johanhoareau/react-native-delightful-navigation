import { Image, Text, View, type ImageProps, type TextProps, type ViewProps } from "react-native"
import { useHandlerXComponent } from "../_core/hooks/useHandlerXComponent"
import type { XComponentProps } from "../types/props"
import { useRef, useState } from "react"
import type { ReactComponent } from "../types/types"
import { HandlerXComponentState } from "../_core/handlerState/HandlerXComponentState"

type XViewProps = XComponentProps & ViewProps
type XTextProps = XComponentProps & TextProps
type XImageProps = XComponentProps & ImageProps

export const XView = ({ registerRef, tag, style, ...restProps }: XViewProps) => {
	// const { xComponentRef, opacityDuringTransition } = useHandlerXComponent(
	// 	registerRef,
	// 	tag,
	// 	style,
	// 	"View"
	// )
	const xComponentRef = useRef<ReactComponent | null>(null)
	const [opacityDuringTransition, setOpacityDuringTransition] = useState<{ opacity?: number } | null>(null)



	return (
		<>
			<HandlerXComponentState
				registerRef={registerRef}
				setOpacityDuringTransition={setOpacityDuringTransition}
				style={style}
				tag={tag}
				type="View"
				xComponentRef={xComponentRef}
			/>
			<View
				ref={xComponentRef}
				style={[
					style,
					opacityDuringTransition
				]}
				{...restProps}
			/>
		</>
	)
}

export const XText = ({ registerRef, tag, style, ...restProps }: XTextProps) => {
	const xComponentRef = useRef<ReactComponent | null>(null)
	const [opacityDuringTransition, setOpacityDuringTransition] = useState<{ opacity?: number } | null>(null)


	return (
		<>
			<HandlerXComponentState
				registerRef={registerRef}
				setOpacityDuringTransition={setOpacityDuringTransition}
				style={style}
				tag={tag}
				type="Text"
				xComponentRef={xComponentRef}
				text={typeof restProps.children === "string" ? restProps.children : undefined}
			/>
			<Text
				ref={xComponentRef}
				style={[
					style,
					opacityDuringTransition
				]}
				{...restProps}
			/>
		</>

	)
}

export const XImage = ({ registerRef, tag, style, ...restProps }: XImageProps) => {
	const xComponentRef = useRef<ReactComponent | null>(null)
	const [opacityDuringTransition, setOpacityDuringTransition] = useState<{ opacity?: number } | null>(null)

	return (
		<>
			<HandlerXComponentState
				registerRef={registerRef}
				setOpacityDuringTransition={setOpacityDuringTransition}
				style={style}
				tag={tag}
				type="Image"
				xComponentRef={xComponentRef}
				source={restProps.source}
			/>
			<Image
				ref={xComponentRef}
				style={[
					style,
					opacityDuringTransition
				]}
				{...restProps}
			/>
		</>
	)
}