/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import { type PropsWithChildren } from "react"
import type { RegisterRef, Route } from "../types/types"
import Animated, { useAnimatedRef, type SharedValue } from "react-native-reanimated";
import HandlerXScreenState from "../_core/handlerState/HandlerXScreenState";
import type { NavigationProp, NavigationState } from "@react-navigation/native";
import { View, type ViewProps } from "react-native";

type XScreenProps = {
	registerRef: RegisterRef,
	transitionIsFinished: SharedValue<boolean>
	navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
		getState(): NavigationState | undefined;
	}
	origin: SharedValue<Route | null>
} & ViewProps & PropsWithChildren

export const XScreen = ({ registerRef, transitionIsFinished, origin, children, navigation, ...props }: XScreenProps) => {

	const landmarkRef = useAnimatedRef()

	return (
		<>
			<Animated.View
				ref={landmarkRef}
				style={{
					position: "absolute",
					top: 0,
					left: 0
					// borderWidth: 4,

				}}
			/>
			<View {...props} style={[props.style, { flex: 1 }]}>
				<HandlerXScreenState
					children={children}
					registerRef={registerRef}
					origin={origin}
					landmarkRef={landmarkRef}
					navigation={navigation}
					transitionIsFinished={transitionIsFinished}
				/>
				{children}
			</View>
		</>
	)
}
