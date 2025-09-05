import AiResponce from '@/components/aiResponce';
import { images } from '@/constants/images';
import { AiContext } from '@/contexts/aiContext';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AskAi = () => {

  const { chatArr, setChatArr, inputText, setInputText, waiting, sendMessage, speakOutLoudNext } = useContext(AiContext);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [chatArr]);


  return (
    <SafeAreaView className="flex-1 pb-10 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <Text className="text-5xl text-center mb-5 text-[#AB8BFF] font-bold">
        Ask Ai
      </Text>
      <View className='flex-row'>
        <TouchableOpacity onPress={() => setChatArr([])} className='ml-5 mb-2 flex-row items-center gap-4'>
          <FontAwesome6 name="pen-to-square" color='white' size={20} />
          <Text className='text-white'>New Chat</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <FlatList
          ref={flatListRef}
          className='px-2'
          data={chatArr}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={
                <View className='mr-20'>
                  <View className='py-2 px-4 my-2 rounded-3xl mr-auto bg-accent'>
                    <Text className='font-bold'>Hi! How can I assist you today?</Text>
                  </View>
                </View>
          }
          renderItem={({ item, index }) => {
            const isLast = index === chatArr.length - 1;
            if (item.role === 'user') {
              return (
                <View className='ml-20'>
                  <View
                    className={`py-2 px-4 my-2 rounded-3xl ml-auto bg-purple-500`}
                  >
                    <Text className='font-bold'>{item.content}</Text>
                  </View>
                </View>
              )
            } else {
              return <AiResponce content={item.content} speakOutLoud={isLast && speakOutLoudNext.current} />;
            }
          }}
          ListFooterComponent={
            waiting ? (
              <ActivityIndicator size="small" color="#AB8BFF" className="my-2 mr-auto" />
            ) : null
          }
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        />

        <View className="flex-row mb-10 mx-2 mt-2">
          <View className="border-2 border-purple-300 rounded-3xl flex-1 justify-center items-center flex-row">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              className="px-2 flex-1 ml-2 text-white"
              placeholder="Describe the movie..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity onPress={sendMessage}>
              <FontAwesome6
                name="paper-plane"
                size={20}
                color="white"
                className="mr-5"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AskAi;
