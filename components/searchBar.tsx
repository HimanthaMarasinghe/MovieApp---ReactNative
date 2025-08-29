import { icons } from "@/constants/icons";
import { forwardRef } from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  onSearch? : (text: string) => void;
  placeholder : string;
  value? : string;
  autoFocus? : boolean;
  onFocus? :() => void;
  editable? : boolean;
}

// Use forwardRef to pass the ref to the TextInput
const SearchBar = forwardRef<TextInput, Props>(
  ({ onSearch, placeholder, value, autoFocus, editable, onFocus }, ref) => {
    return (
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
        <Image
          source={icons.search}
          className="size-5"
          resizeMode="contain"
          tintColor="#ab8bff"
        />
        <TextInput
          ref={ref} // Attach ref to TextInput
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onFocus={onFocus}
          editable={editable}
          onChangeText={onSearch}
          placeholderTextColor="#A8B5DB"
          className="flex-1 ml-2 text-white"
        />
      </View>
    );
  }
);

export default SearchBar;