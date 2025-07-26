import LoginForm from "@/components/loginForm";
import RegForm from "@/components/regForm";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [logedIn, setLogedIn] = useState(true);
  const [loginFormActive, setLoginFormActive] = useState(false);

  return (
    <>
      <View className="flex-1 bg-primary pb-40">
        <Image source={images.bg} className="absolute w-full z-0" />
        {logedIn ? (
          <View className="flex-1 justify-center p-20">
            <Image source={icons.logo} className="mb-10 mx-auto size-20" />
            <Text className="text-white text-center text-6xl">Hi User!</Text>
            <TouchableOpacity
              onPress={() => setLogedIn(false)}
              className="bg-purple-500 p-3 rounded mt-4"
              >
              <Text className="text-white text-center font-bold">Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : loginFormActive ? (
          <LoginForm setLoginFormActive={setLoginFormActive} />
        ) : (
          <RegForm setLoginFormActive={setLoginFormActive}/>
        )}
      </View>
    </>
  )
}
