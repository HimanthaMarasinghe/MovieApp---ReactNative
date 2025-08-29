import { icons } from "@/constants/icons";
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "@/contexts/authContext";
import { appwriteFunction } from "@/services/appWrite";
import { Models } from "appwrite";


export default ({ movie }: { movie: Movie }) => {
    const {isLoggedIn} = useContext(AuthContext);
    const [favorite, setFavorite] = useState(false);
    const [watchState, setWatchState] = useState(0); // 0 - None, 1 - Want to watch, 2 - Watched

    const FUNCTION_ID = process.env.EXPO_PUBLIC_SAVE_FUNCTION_ID;

    useEffect(() => {
        console.log(`Movie name: ${movie.title} - State: ${movie.state}`);
        setWatchState(movie.state || 0);
    }, [movie.state]);

    const createExecution = async () => {
        if (!FUNCTION_ID) {
            Alert.alert('Error', 'Function ID is not set');
            return;
        }
        if(!isLoggedIn) {
            Alert.alert("Log in to save movies");
            return;
        }
        try {
            const newWatchState = (watchState + 1) % 3;
            
            // const state = newWatchState === 0 ? 'not_set' : newWatchState === 1 ? 'want_to_watch' : 'watched';
            
            const execution: Models.Execution = await appwriteFunction.createExecution(
                FUNCTION_ID,
                JSON.stringify({ 'movieId': (movie.id).toString(), state : newWatchState })
            );
            console.log('Function execution started:', execution);
            if (execution.status === 'completed' && [200, 201].includes(execution.responseStatusCode)) {
                setWatchState(newWatchState);
            } else {
                console.error('Execution failed:', execution);
                Alert.alert('Error', 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Link href={`/movies/${movie.id}`} asChild className="border border-gray-500/50 rounded-lg">
            <TouchableOpacity className="w-[50%]">
                <Image
                    source={{ 
                        uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/150'
                     }}
                    className="w-full h-72 rounded-lg"
                    resizeMode="cover"
                />
                <Text numberOfLines={1} className="text-white font-bold mt-2 px-1">{movie.title}</Text>
                <View className="flex-row item-center justify-start gap-x-1 px-1">
                    <Image
                        source={icons.star}
                        className="size-4"
                    />
                    <Text className="text-xs text-white font-bold uppercase">{Math.round(movie.vote_average / 2)}</Text>
                </View>
                <View className="flex-row items-center justify-between px-1 mb-1">
                     <Text className="text-xs text-light-300 font-medium mt-1">
                        {movie.release_date?.split('-')[0]}
                     </Text>
                     <View className="flex-row items-center gap-x-2">
                        <TouchableOpacity 
                            onPress={createExecution}
                            >
                            <FontAwesome6 
                                name={watchState === 2 ? "check-circle" : "eye"}
                                size={20} 
                                color={watchState === 0 ? "white" : "#00d12a"} 
                                className="bg-gray-500/80 rounded-md p-1"
                                solid={watchState !== 0}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setFavorite(prev => !prev)}
                            >
                            <FontAwesome6 
                                name="heart"
                                size={20} 
                                color={favorite ? "red" : "white"} 
                                className="bg-gray-500/80 rounded-md p-1"
                                solid={favorite}
                            />
                        </TouchableOpacity>
                     </View>
                </View>
            </TouchableOpacity>
        </Link>
    )
}