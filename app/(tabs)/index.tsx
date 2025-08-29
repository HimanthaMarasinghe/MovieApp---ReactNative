import MovieCard from "@/components/movieCard";
import SearchBar from "@/components/searchBar";
import TrendingCard from "@/components/trendingCard";
import { images } from "@/constants/images";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: movies, loading: moviesLoading, error: moviesError, refetch } = useFetch(() =>
    fetchMovies({ query: searchTerm })
  );

  const scrollViewRef = useRef<FlatList>(null);
  const searchBarRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  // Scroll to SearchBar when keyboard appears
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (scrollViewRef.current && searchBarRef.current) {
        searchBarRef.current.measureInWindow((x, y, width, height) => {
          const adjustedOffset = y - insets.top;
          scrollViewRef.current?.scrollToOffset({ offset: adjustedOffset, animated: true });
        });
      }
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [insets.top]);

  useEffect(() => {
    const func = setTimeout(async () => {
      await refetch();
    }, 500);
    return () => clearTimeout(func);
  }, [searchTerm]);

  const { data: trendingMovies, loading: trendingLoading, error: trendingError, refetch: refetchTrending } =
    useFetch(fetchTrendingMovies);

  const refreshHome = useCallback(() => {
    refetch();
    refetchTrending();
  }, [refetch, refetchTrending]);

  return (
      <View className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0" />
        <FlatList
          ref={scrollViewRef}
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'center',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="pb-32 px-5 mb-20"
          refreshControl={<RefreshControl refreshing={moviesLoading} onRefresh={refreshHome} />}
          ListHeaderComponent={
            <>
              <Text className="text-2xl text-center mt-10 mb-5 text-[#AB8BFF] font-bold">
                Movies Made Easy!
              </Text>
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                <FlatList
                  data={trendingMovies}
                  renderItem={({ item, index }) => <TrendingCard movie={item} index={index} />}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                  className="mb-5"
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
              <SearchBar
                ref={searchBarRef}
                placeholder="Search movies..."
                value={searchTerm}
                onSearch={setSearchTerm}
              />
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                {searchTerm.trim() ? `Search results for "${searchTerm}"` : "Latest Movies"}
              </Text>
            </>
          }
          renderItem={({ item }) => <MovieCard movie={item} />}
          ListEmptyComponent={
            !moviesLoading && !moviesError ? (
              <Text className="text-white text-center">No movies found</Text>
            ) : null
          }
        />
      </View>
  );
}