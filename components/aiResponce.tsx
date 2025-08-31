import { FontAwesome6 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import MovieCard from './horMovieCard';


interface AImovies {
  title : string;
  overview : string;
}

const AiResponce = ({content} : {content: string}) => {
    const [speaking, setSpeaking] = useState(false);
    const jsonContent = JSON.parse(content);

    const speakMessage = useCallback((message: string, movies: AImovies[]) => {
        Speech.stop();
        setSpeaking(true);
        const intro = message + ". ";
        const moviesText = movies.map((movie, i) => {
            return `${movie.title}. ${movie.overview}.`;
        }).join(" ");

        const fullText = intro + moviesText;

        Speech.speak(fullText, {
            language: "en-US",
            onDone: () => setSpeaking(false),   // ✅ reset when finished
            onStopped: () => setSpeaking(false) // ✅ also reset if stopped
        });
    }, [setSpeaking]);

    const stopSpeaking = useCallback(() => {
        setSpeaking(false);
        Speech.stop();
    }, [setSpeaking]);

    return (
    <View className='flex-row mr-20 items-start'>
        <View>
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
        {
        speaking ? (
            <TouchableOpacity onPress={stopSpeaking} className='mt-4 ml-2'>
            <FontAwesome6 name="pause" color="#aaaaaa" size={20} />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => speakMessage(jsonContent.message, jsonContent.movies)} className='mt-4 ml-2'>
            <FontAwesome6 name="volume-high" color="#aaaaaa" size={20} />
            </TouchableOpacity>
        )
        }
    </View>
    );
}

export default AiResponce;