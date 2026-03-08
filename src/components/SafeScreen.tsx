import React from "react";
import { View, StatusBar, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeScreen({ children, style }) {
    const insets = useSafeAreaInsets();

    return (
        <>
            {/* Makes the status bar transparent so insets.top is the only spacing */}
            <StatusBar translucent backgroundColor="transparent" />
            <View
                style={[
                    {
                        flex: 1,
                        paddingTop: Platform.OS === "android" ? 0 : insets.top,
                        paddingBottom: insets.bottom,
                    },
                    style,
                ]}
            >
                {children}
            </View>
        </>
    );
}
