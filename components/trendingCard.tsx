import { images } from "@/constants/images";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";


export default ({ movie, index }: TrendingCardProps) => {
    return (
        <Link href={`/movies/${movie.id}`} asChild>
            <TouchableOpacity className="w-32 relative pl-5">
                <Image
                    source={{ 
                        uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/150'
                     }}
                    className="w-32 h-48 rounded-lg"
                    resizeMode="cover"
                />
                <View className="absolute bottom-9 left-0 px-2 py-1 rounded-full">
                     <Text className="text-6xl font-extrabold text-black absolute left-2.5 top-1.5 z-0">
                        {index + 1}
                    </Text>
                     <MaskedView maskElement={
                        <Text className="font-bold text-white text-6xl">{index + 1}</Text>
                     }>
                        <Image source={images.rankingGradient} className="w-24 h-16" resizeMode="cover" />
                    </MaskedView>
                </View>
                <Text className="text-light-200 font-bold mt-2" numberOfLines={2}>{movie.title}</Text>
            </TouchableOpacity>
        </Link>
    )
}