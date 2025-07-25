import { icons } from "@/constants/icons";
import { Image, TextInput, View } from "react-native";

interface Props {
  onPress?: () => void;
  onSearch?: (text: string) => void;
  placeholder: string;
  value?: string;
}

export default ({ onPress, onSearch, placeholder, value } : Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
        <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8bff" />
        <TextInput 
          onPress={onPress}
          placeholder={placeholder} 
          value={value}
          onChangeText={onSearch}
          placeholderTextColor="#A8B5DB"
          className="flex-1 ml-2 text-white" />
    </View>
  );
}