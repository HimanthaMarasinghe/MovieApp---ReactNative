import { ActivityIndicator, View } from "react-native";

export default () => {
    return (
        <View className="border border-gray-500/50 rounded-lg w-[50%] h-80 justify-center">
            <ActivityIndicator size={'large'} color={'#fff'} style={{ transform: [{ scale: 2 }] }}/>
        </View>
    )
}