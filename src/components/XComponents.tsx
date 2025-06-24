import { View, type ViewProps } from "react-native"
import { useHandlerXComponent } from "../_core/hooks/useHandlerXComponent"
import type { XComponentProps } from "../types/props"

type XViewProps = XComponentProps & ViewProps

export const XView = ({ registerRef, tag, ...restProps }: XViewProps) => {
	const { xComponentRef } = useHandlerXComponent(
		registerRef,
		tag,
		restProps.style,
		"View"
	)

	return (
		<View
			ref={xComponentRef}
			{...restProps}
		/>
	)
}
