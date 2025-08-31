import { AuthContext } from "@/contexts/authContext";
import { updateFav, updateWatchState } from "@/services/api";
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({movie} : {movie : Movie}) => {
    const { isLoggedIn } = useContext(AuthContext);
    const { title, release_date, vote_average, overview, poster_path } = movie;
    const [favourite, setFavourite] = useState(movie.favourite ? 1 : 0); //-1 - loading, 0 - None, 1 - Favourite
    const [watchState, setWatchState] = useState(movie.state || 0); //-1 - loading, 0 - None, 1 - Want to watch, 2 - Watched

    useEffect(() => {
        setWatchState(movie.state || 0);
        setFavourite(movie.favourite ? 1 : 0);
    }, [movie.state, movie.favourite]);

    const executeWatchState = async () => {
        await updateWatchState(movie.id, watchState, setWatchState, isLoggedIn);
    }

    const executeFavorite = async () => {
        await updateFav(movie.id, favourite, setFavourite, isLoggedIn);
    }
  
  return (
    <Link href={`/movies/${movie.id}`} asChild>
        <TouchableOpacity className="bg-gray-800 rounded-xl p-3 my-2 shadow-md">
        {/* Top Row: Image + Info */}
            <View className="flex-row items-start">
                {/* Image */}
                <Image
                source={{ uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                : 'https://via.placeholder.com/150' }}
                className="w-24 h-36 rounded-lg"
                resizeMode="cover"
                />

                {/* Title, Year, Rating */}
                <View className="flex-1 ml-3">
                <Text className="text-white font-bold text-lg">{title}</Text>
                <Text className="text-gray-400 mt-1">{release_date?.split('-')[0]} • ⭐ {Math.round(vote_average / 2)}</Text>
                <View className="flex-row items-center gap-x-2">
                    {
                        watchState < 0 ? <ActivityIndicator size="small" color="white" /> : 
                        (
                        <TouchableOpacity 
                            onPress={executeWatchState}
                            >
                            <FontAwesome6 
                                name={watchState === 2 ? "check-circle" : "eye"}
                                size={20} 
                                color={watchState === 0 ? "white" : "#00d12a"} 
                                className="bg-gray-500/80 rounded-md p-1"
                                solid={watchState !== 0}
                            />
                        </TouchableOpacity>
                        )
                    }
                    {
                        favourite < 0 ? <ActivityIndicator size="small" color="white" className="w-[27]" /> :
                        (
                        <TouchableOpacity 
                            onPress={executeFavorite}
                            >
                            <FontAwesome6 
                                name="heart"
                                size={20} 
                                color={favourite === 1 ? "red" : "white"} 
                                className="bg-gray-500/80 rounded-md p-1"
                                solid={favourite === 1}
                            />
                        </TouchableOpacity>
                        )
                    }
                    </View>
                </View>
            </View>

            {/* Overview */}
            <Text className="text-gray-300 mt-2 leading-5" numberOfLines={4}>
                {overview}
            </Text>
        </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;