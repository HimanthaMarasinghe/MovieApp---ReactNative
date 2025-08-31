import { images } from "@/constants/images";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TabScreen() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");

  return (
    <SafeAreaView className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0" />
        <Text className="text-5xl text-center mb-5 text-[#AB8BFF] font-bold">
          Saved
        </Text>
      {/* Tabs */}
      <View className="flex-row justify-around shadow-md">
        {["tab1", "tab2", "tab3"].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 ${
              activeTab === tab ? "border-b-4 border-purple-500" : ""
            }`}
            onPress={() => setActiveTab(tab as "tab1" | "tab2" | "tab3")}
          >
            <Text
              className={`text-center font-bold ${
                activeTab === tab ? "text-purple-600" : "text-gray-500"
              }`}
            >
              {tab === 'tab1' ? (
                <>
                  <FontAwesome6 
                      name="heart"
                      size={20} 
                      color="red"
                      solid
                  />
                  {"   "}
                  Favourite
                </>
              ) : tab === 'tab2' ? (
                <>
                  <FontAwesome6 
                      name="eye"
                      size={20} 
                      color="#00d12a"
                      solid
                  />
                  {"   "}
                  Want to watch
                </>
              ) : (
                <>
                  <FontAwesome6 
                      name="check-circle"
                      size={20} 
                      color="#00d12a"
                      solid
                  />
                  {"   "}
                  Watched
                </>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        {activeTab === "tab1" && (
          <Text className="text-lg font-semibold text-gray-700">Content of Tab 1</Text>
        )}
        {activeTab === "tab2" && (
          <Text className="text-lg font-semibold text-gray-700">Content of Tab 2</Text>
        )}
        {activeTab === "tab3" && (
          <Text className="text-lg font-semibold text-gray-700">Content of Tab 3</Text>
        )}
      </View>
    </SafeAreaView>
  );
}