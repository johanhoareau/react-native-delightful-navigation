import React, { useEffect, useRef, useState, type PropsWithChildren } from "react"
import { View } from "react-native"
import { useHeaderHeight } from '@react-navigation/elements';
import type {
	InitialXData,
	// InProgressXComponentData,
	RegisterRef,
} from "../types/types"
import { parseTree } from "../_core/utils/parseTree"
import Animated from "react-native-reanimated";
import { useTransitionStore } from "../_core/stores/useTransitionStore";
import HandlerXScreenState from "../_core/handlerState/HandlerXScreenState";
import type { NavigationProp, NavigationState } from "@react-navigation/native";

type XScreenProps = {
	registerRef: RegisterRef,
	navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
		getState(): NavigationState | undefined;
	}
} & PropsWithChildren

export const XScreen = ({ registerRef, children, navigation }: XScreenProps) => {

	const landmarkRef = useRef<View | null>(null)

	return (
		<>
			<HandlerXScreenState
				children={children}
				registerRef={registerRef}
				landmarkRef={landmarkRef}
				navigation={navigation}
			/>
			<Animated.View ref={landmarkRef} />
			{children}
		</>
	)
}
