import MovieCard from '@/components/horMovieCard';
import { images } from '@/constants/images';
import { appwriteFunction } from '@/services/appWrite';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Chat {
  role: 'user' | 'model';
  content: string;
}

const AskAi = () => {
  const functionId = process.env.EXPO_PUBLIC_CHATWITH_AI_ID || '';
  const flatListRef = useRef<FlatList>(null);

  const [chatArr, setChatArr] = useState<Chat[]>([]);
  const [inputText, setInputText] = useState('');
  const [waiting, setWaiting] = useState(false);

  // Scroll to bottom when chat updates
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [chatArr]);

  // Send message
  const sendMessage = async () => {
    if (!inputText.trim() || !functionId) return;
    setWaiting(true);

    const userMessage: Chat = {
      role: 'user',
      content: inputText,
    };
    const updatedChat = [...chatArr, userMessage];
    setChatArr(updatedChat);
    setInputText('');

    try {

      const payload = JSON.stringify({ chatHistory : updatedChat });
      const response = await appwriteFunction.createExecution(
          functionId,
          payload
      );
      if (response.responseStatusCode !== 200) {
          throw new Error(`Function execution failed with status: ${response.status}`);
      }
      console.log(response);

      // 3. Append AI response (assuming API returns same Chat format)
      const aiMessage: Chat = {
        role: 'model',
        content: response.responseBody,
      };
      setChatArr([...updatedChat, aiMessage]);
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <View className="flex-1 pb-10 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <Text className="text-5xl text-center mt-10 mb-5 text-[#AB8BFF] font-bold">
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
          renderItem={({ item }) => {
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
              const jsonContent = JSON.parse(item.content);
              return (
                <View className='mr-20'>
                  <View className='py-2 px-4 my-2 rounded-3xl mr-auto bg-accent'>
                    <Text className='font-bold'>{jsonContent.message}</Text>
                  </View>

                  {jsonContent.movies && jsonContent.movies.length > 0 && (
                    <FlatList
                      data={jsonContent.movies}
                      keyExtractor={(_, idx) => idx.toString()}
                      renderItem={({ item }) => (
                        <MovieCard movie={item} />
                      )}
                    />
                  )}
                </View>
              );
              
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
            {
              inputText ? (
                <TouchableOpacity onPress={sendMessage}>
                  <FontAwesome6
                    name="paper-plane"
                    size={20}
                    color="white"
                    className="mr-5"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={sendMessage}>
                  <FontAwesome6
                    name="microphone-lines"
                    size={20}
                    color="white"
                    className="mr-5"
                  />
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AskAi;
