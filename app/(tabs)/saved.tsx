import { appwriteAccount } from "@/services/appWrite";
import { Button, Text, View } from "react-native";

const presMe = async () => {
  const user = await appwriteAccount.get();
  console.log("Current user from fun:", user);
}

export default function Saved() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-5xl text-accent font-bold">Saved</Text>
      <Button title="Press me" onPress={presMe} />
    </View>
  );
}
