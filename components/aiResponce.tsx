import { AiContext } from '@/contexts/aiContext';
import { useSpeechStore } from '@/store/speechStore';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import MovieCard from './horMovieCard';


const AiResponce = ({content, speakOutLoud} : {content: string, speakOutLoud? : boolean}) => {
    const jsonContent = JSON.parse(content);
    const message = jsonContent.message;
    const movies : Movie[] = jsonContent.movies || [];
    const { startSpeaking, stopSpeaking } = useSpeechStore();
    const [speakingState, setSpeakingState ] = useState(false);
    const {speakOutLoudNext} = useContext(AiContext);

    const speakMessage = useCallback(() => {
        Speech.stop();
        startSpeaking();
        setSpeakingState(true);
        const intro = message + ". ";
        const moviesText = movies.map((movie, i) => {
            return `${movie.title}. ${movie.overview}.`;
        }).join(" ");

        const fullText = intro + moviesText;

        Speech.speak(fullText, {
            language: "en-US",
            onDone: () => {
                stopSpeaking()
                setSpeakingState(false);
            },
            onStopped: () => {setSpeakingState(false)}
        });
    }, [startSpeaking, stopSpeaking, message, movies]);

    useEffect(() => {
        if(speakOutLoud) {
            speakMessage();
            speakOutLoudNext.current = false;
        }
    }, []);


    return (
    <View className='flex-row mr-20 items-start'>
        <View>
        <View className='py-2 px-4 my-2 rounded-3xl mr-auto bg-accent'>
            <Text className='font-bold'>{jsonContent.message}</Text>
        </View>

        {movies && movies.length > 0 && (
            <FlatList
            data={movies}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
            <MovieCard movie={item} />
            )}
            />
        )}
        </View>
        {
        speakingState ? (
            <TouchableOpacity onPress={stopSpeaking} className='mt-4 ml-2'>
                <FontAwesome6 name="pause" color="#aaaaaa" size={20} />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => speakMessage()} className='mt-4 ml-2'>
                <FontAwesome6 name="volume-high" color="#aaaaaa" size={20} />
            </TouchableOpacity>
        )
        }
    </View>
    );
}

export default AiResponce;