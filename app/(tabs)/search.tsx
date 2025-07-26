import MovieCard from "@/components/movieCard";
import SearchBar from "@/components/searchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  const {data: movies, loading: moviesLoading, error: moviesError, refetch} = useFetch(() => fetchMovies( 
    { query: searchTerm }
  ));

  useEffect(() => {
    const func = setTimeout(async () => {
      if (searchTerm.trim()) {
        await refetch();
      }
    }, 500);
    return () => clearTimeout(func);
  }, [searchTerm]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard movie={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        className="px-5 mb-20"
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 item-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar 
                placeholder="Search movies..." 
                value={searchTerm}
                onSearch={setSearchTerm}
                autoFocus={true}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3" />
            )}
            {moviesError && (
              <Text className="text-red-500 px-5 my-3">Error: {moviesError.message}</Text>
            )}
            {!moviesLoading && !moviesError && searchTerm.trim() && movies?.length > 0 && (
              <Text className="text-lg text-white font-bold mb-3">Search Results for "{searchTerm}"</Text>
            )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchTerm.trim() ?
                  `No results found for "${searchTerm}"` :
                  "Search for movies."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
