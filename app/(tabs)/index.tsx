import MovieCard from "@/components/movieCard";
import SearchBar from "@/components/searchBar";
import TrendingCard from "@/components/trendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {data: trendingMovies, loading: trendingLoading, error: trendingError} = useFetch(fetchTrendingMovies);

  const {data: movies, loading: moviesLoading, error: moviesError} = useFetch(() => fetchMovies( 
    { query: '' }
  ));

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"/>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ 
              justifyContent: 'center',
              gap: 20,
              paddingRight: 5,
              marginBottom: 10
            }}
            className="pb-32 px-5 mb-20"
            ListHeaderComponent={
              <>
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
                <Link href={`/search`} asChild>
                  <TouchableOpacity>
                    <SearchBar
                      placeholder="Search for movies..."
                      editable={false}
                    />
                  </TouchableOpacity>
                </Link>
                <View className="mt-10">
                  <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                  <FlatList
                    data={trendingMovies}
                    renderItem={({ item, index }) => (
                      <TrendingCard movie={item} index={index} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }}
                    className="mb-5"
                    ItemSeparatorComponent={() => <View className="w-4" />}
                  />
                </View>
                <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
                {moviesLoading && (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    className="mt-10"
                  />
                )}
              </>
            }
            renderItem={({ item }) => {
              return (
                <MovieCard movie={item} />
              );
            }}
            ListEmptyComponent={
              !moviesLoading && !moviesError
                ? <Text className="text-white text-center">No movies found</Text>
                : null
            }
          />
        </View>
  );
}
