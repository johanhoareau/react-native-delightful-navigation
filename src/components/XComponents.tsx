import { View, type ViewProps } from "react-native"
import { useHandlerXComponent } from "../_core/hooks/useHandlerXComponent"
import type { XComponentProps } from "../types/props"

type XViewProps = XComponentProps & ViewProps

export const XView = ({ registerRef, tag, style, ...restProps }: XViewProps) => {
	const { xComponentRef, opacityDuringTransition } = useHandlerXComponent(
		registerRef,
		tag,
		style,
		"View"
	)



	return (
		<View
			ref={xComponentRef}
			style={[
				style,
				opacityDuringTransition
			]}
			{...restProps}
		/>
	)
}
