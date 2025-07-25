import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default ({ movie }: { movie: Movie }) => {
    return (
        <Link href={`/movies/${movie.id}`} asChild>
            <TouchableOpacity className="w-[30%]">
                {/* <Image
                    source={{ 
                        uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/150'
                     }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                /> */}
                <Text numberOfLines={1} className="text-white font-bold mt-2">{movie.title}</Text>
                <View className="flex-row item-center justify-start gap-x-1">
                    <Image
                        source={icons.star}
                        className="size-4"
                    />
                    <Text className="text-xs text-white font-bold uppercase">{Math.round(movie.vote_average / 2)}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                     <Text className="text-xs text-light-300 font-medium mt-1">
                        {movie.release_date?.split('-')[0]}
                     </Text>
                     <Text className="text-xs text-light-300 font-medium uppercase">
                        Movie
                     </Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}