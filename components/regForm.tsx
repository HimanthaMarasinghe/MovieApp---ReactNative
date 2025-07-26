import { icons } from "@/constants/icons";
import { appwriteAccount } from "@/services/appWrite";
import { register } from "@/services/auth";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen({setLoginFormActive, setUser} : {setLoginFormActive: Dispatch<SetStateAction<boolean>>, setUser: Dispatch<SetStateAction<null | Awaited<ReturnType<typeof appwriteAccount.get>>>>}) {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
        };

    const handleRegister = async () => {
        if (!email || !username || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await register(email, password, username);
            console.log("Registered successfully:", response);
            setUser(await appwriteAccount.get());
        } catch (err) {
            alert("Registration failed");
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
            Create an account
        </Text>
        <View className="flex flex-col items-start mb-2">
            <Text className="text-white mb-2">Username</Text>
            <TextInput
                placeholder="Ex: PopcornBandit123"
                value={username}
                onChangeText={setUsername}
                className="border border-gray-300 p-2 rounded w-full text-white"
                placeholderTextColor={"#A8B5DB77"}
            />
        </View>
        <View className="flex flex-col items-start mb-2">
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
        <View className="flex flex-col items-start mb-2">
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
        <View className="flex flex-col items-start mb-2">
            <Text className="text-white mb-2">Re-Enter the Password</Text>
            <TextInput
                placeholder="Re-Enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="border border-gray-300 p-2 rounded w-full text-white"
                placeholderTextColor={"#A8B5DB77"}
            />
        </View>
        <TouchableOpacity
            onPress={handleRegister}
            className="bg-purple-500 p-3 rounded mt-4"
            >
            <Text className="text-white text-center font-bold">Register</Text>
        </TouchableOpacity>
        <View className=" mt-5 flex flex-row justify-center">
            <Text className="text-center text-white">
                Already have an account?
            </Text>
            <TouchableOpacity onPress={() => setLoginFormActive(true)}>
                <Text className="text-center text-purple-500"> Login</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}
