import { AuthContext } from "@/contexts/authContext";
import { updateWatchState } from "@/services/api";
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({movie} : {movie : Movie}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { title, release_date, vote_average, overview, poster_path } = movie;
  const [favorite, setFavorite] = useState(false);
  const [watchState, setWatchState] = useState(0); // 0 - None, 1 - Want to watch, 2 - Watched

    useEffect(() => {
        setWatchState(movie.state || 0);
    }, [movie.state]);

    const createExecution = async () => {
        await updateWatchState(movie.id, watchState, setWatchState, isLoggedIn);
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