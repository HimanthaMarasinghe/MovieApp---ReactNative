import { icons } from "@/constants/icons";
import { AuthContext } from "@/contexts/authContext";
import { updateFav, updateWatchState } from "@/services/api";
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";



export default ({ movie }: { movie: Movie }) => {
    const {isLoggedIn} = useContext(AuthContext);
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
            </TouchableOpacity>
        </Link>
    )
}