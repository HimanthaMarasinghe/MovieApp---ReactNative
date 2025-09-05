import LoginForm from "@/components/loginForm";
import RegForm from "@/components/regForm";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { AuthContext } from "@/contexts/authContext";
import { appwriteAccount } from "@/services/appWrite";
import { useFocusEffect } from '@react-navigation/native';
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

  const [user, setUser] = useState<null | Awaited<ReturnType<typeof appwriteAccount.get>>>(null);
  const [loading, setLoading] = useState(true);
  const [loginFormActive, setLoginFormActive] = useState(false);
  const { logout } = useContext(AuthContext);
  
  useFocusEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await appwriteAccount.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  });

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Log out error ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => setLoading(false), [user]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-primary pb-40">
        <Image source={images.bg} className="absolute w-full z-0" />
        {loading ? (
          <View className="flex-1 justify-center p-20">
            <ActivityIndicator size={"large"} color={'#fff'} style={{ transform: [{ scale: 2 }] }}/>
          </View>
        ) :
        user ? (
          <View className="flex-1 justify-center p-20">
            <Image source={icons.logo} className="mb-10 mx-auto size-20" />
            <Text className="text-white text-center text-6xl">Hi {user?.name}!</Text>
            <TouchableOpacity
              onPress={handleLogOut}
              className="bg-purple-500 p-3 rounded mt-4"
              >
              <Text className="text-white text-center font-bold">Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : loginFormActive ? (
          <LoginForm setLoginFormActive={setLoginFormActive} setUser={setUser} setLoading={setLoading}/>
        ) : (
          <RegForm setLoginFormActive={setLoginFormActive} setUser={setUser}/>
        )}
        {/* <Link href="/widgetPreview" asChild>
          <TouchableOpacity
            onPress={handleLogOut}
            className="bg-purple-500 p-3 rounded mt-4"
            >
            <Text className="text-white text-center font-bold">Widget Preview</Text>
          </TouchableOpacity>
        </Link> */}
      </SafeAreaView>
    </>
  )
}
