import { useRef, type PropsWithChildren } from "react"
import { View } from "react-native"
import type { RegisterRef, Route } from "../types/types"
import Animated, { type SharedValue } from "react-native-reanimated";
import HandlerXScreenState from "../_core/handlerState/HandlerXScreenState";
import type { NavigationProp, NavigationState } from "@react-navigation/native";

type XScreenProps = {
	registerRef: RegisterRef,
	transitionIsFinished: SharedValue<boolean>
	navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
		getState(): NavigationState | undefined;
	}
	origin: SharedValue<Route | null>,
	destination: SharedValue<Route | null>
} & PropsWithChildren

export const XScreen = ({ registerRef, transitionIsFinished, origin, destination, children, navigation }: XScreenProps) => {

	const landmarkRef = useRef<View | null>(null)

	return (
		<>
			<HandlerXScreenState
				children={children}
				registerRef={registerRef}
				origin={origin}
				destination={destination}
				landmarkRef={landmarkRef}
				navigation={navigation}
				transitionIsFinished={transitionIsFinished}
			/>
			<Animated.View ref={landmarkRef} />
			{children}
		</>
	)
}
