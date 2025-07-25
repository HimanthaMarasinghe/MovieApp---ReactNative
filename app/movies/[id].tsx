import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({label, value}: MovieInfoProps) => (
  <View className="flex-col item-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">{value || 'N/A'}</Text>
  </View>
)

export default function MovieDetails() {

  const {id} = useLocalSearchParams();
  const {data: movie, loading, error} = useFetch(() => fetchMovieDetails(id as string));

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image 
            source={{uri : `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} 
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col item-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">{movie?.release_date}</Text>
            <Text className="text-light-200 text-sm">{movie?.runtime} min</Text>
          </View>
          <View className="flex-col items-start">
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image
                source={icons.star}
                className="size-4"
              />
              <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average ?? 0)}/10</Text>
              <Text className="text-light-200 text-sm">({movie?.vote_count} votes)</Text>
            </View>
            <MovieInfo label="Overview" value={movie?.overview} />
            <MovieInfo label="Genres" value={movie?.genres?.map(genre => genre.name).join(", ") || 'N/A'} />
            <View className="flex flex-row justify-between w-1/2">
              <MovieInfo label="Budget" value={`$${(movie?.budget ?? 0) / 1_000_000}M`} />
              <MovieInfo label="Revenue" value={`$${Math.round((movie?.revenue ?? 0) / 1_000_000)}M`} />
            </View>
            <MovieInfo label="Production Companies" value={movie?.production_companies?.map(company => company.name).join(", ") || 'N/A'} />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row item-center justify-center z-50" onPress={router.back}>
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="fff"
          resizeMode="contain"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
