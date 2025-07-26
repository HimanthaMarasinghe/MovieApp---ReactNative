import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

export default ({ movie }: { movie: Movie }) => {
    const [favorite, setFavorite] = useState(false);
    const [watchState, setWatchState] = useState(0); // o - None, 1 - Want to watch, 2 - Watched
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
                            onPress={() => setWatchState(prev => (prev + 1) % 3)}
                            >
                            <Icon 
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
                            <Icon 
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