import { icons } from "@/constants/icons";
import { appwriteAccount } from "@/services/appWrite";
// import { login } from "@/services/auth";
import { AuthContext } from "@/contexts/authContext";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen({setLoginFormActive, setUser, setLoading} : {setLoginFormActive: Dispatch<SetStateAction<boolean>>, setUser: Dispatch<SetStateAction<null | Awaited<ReturnType<typeof appwriteAccount.get>>>>, setLoading: Dispatch<SetStateAction<boolean>>}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await login(email, password);
            console.log("Login successful:", response);
            setUser(await appwriteAccount.get());
        } catch (err) {
            alert("Login failed");
        }
    };

  return (
    <KeyboardAvoidingView 
        className="flex-1 justify-center p-20" 
        behavior="padding"
        keyboardVerticalOffset={50}
        >
        <Image source={icons.logo} className="mb-10 mx-auto size-20" />
        <Text className="text-2xl text-white font-bold text-center mb-5">
            Log In to your Account
        </Text>
        <View className="flex flex-col items-start mb-5">
            <Text className="text-white mb-2">E-mail</Text>
            <TextInput
                placeholder="example@domain.com"
                value={email}
                onChangeText={setEmail}
                className="border border-gray-300 p-2 rounded w-full text-white"
                placeholderTextColor={"#A8B5DB77"}
                 keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
        <View className="flex flex-col items-start mb-5">
            <Text className="text-white mb-2">Password</Text>
            <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border border-gray-300 p-2 rounded w-full text-white"
                placeholderTextColor={"#A8B5DB77"}
            />
        </View>
        <TouchableOpacity
            onPress={handleLogin}
            className="bg-purple-500 p-3 rounded mt-4"
            >
            <Text className="text-white text-center font-bold">Log In</Text>
        </TouchableOpacity>
        <View className=" mt-5 flex flex-row justify-center">
            <Text className="text-center text-white">
                New to Movie App?
            </Text>
            <TouchableOpacity onPress={() => setLoginFormActive(false)}>
                <Text className="text-center text-purple-500"> Register</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}
