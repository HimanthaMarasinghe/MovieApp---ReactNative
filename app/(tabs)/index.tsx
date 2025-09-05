import MovieCard from "@/components/movieCard";
import MovieLoadingCard from "@/components/movieLoadingCard";
import SearchBar from "@/components/searchBar";
import TrendingCard from "@/components/trendingCard";
import { images } from "@/constants/images";
import { AuthContext } from "@/contexts/authContext";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { TrendingWidget } from "@/widget/widget";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { requestWidgetUpdate } from 'react-native-android-widget';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: movies, setData: setMovies, loading: moviesLoading, error: moviesError, refetch } = useFetch(() =>
    fetchMovies({ query: searchTerm })
  );

  const { isLoggedIn } = useContext(AuthContext);

  const scrollViewRef = useRef<FlatList>(null);
  const searchBarRef = useRef<View>(null);
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

  useEffect(() => {
    setSearchTerm('');
    refreshHome();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!trendingMovies || trendingMovies.length === 0) return;
    const filteredMovies = trendingMovies.map((movie : Movie) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_count ? `${(movie.vote_average).toFixed(1)} / 10` : 'N/A',
        image: movie.poster_path
      }));
    requestWidgetUpdate({
      widgetName: 'TMWidget',
      renderWidget: () => <TrendingWidget movies={filteredMovies} />,
      widgetNotFound: () => {
        console.log("Widget not found");
      }
    });
  }, [trendingMovies]);

  return (
      <SafeAreaView className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0" />
        <FlatList
          ref={scrollViewRef}
          data={moviesLoading ? Array.from({ length: 6 }).map((_, i) => ({ id: `loading-${i}`, loading: true })) : movies}
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
              <Text className="text-2xl text-center text-[#AB8BFF] font-bold">
                Movies Made Easy!
              </Text>
              <View className="mt-5">
                {trendingMovies && trendingMovies.length > 0 ? (
                  <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                ) : null}
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
              {searchTerm.trim() ? (
                <View className="flex-row items-center">
                  <Text className="text-lg text-white font-bold mt-5 mb-3">
                    {`Search results for "${searchTerm}"`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSearchTerm('')}
                    className="bg-purple-500/50 h-10 px-3 rounded ml-auto justify-center"
                    >
                    <Text className="text-white text-center font-bold">Clear Search</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Latest Movies
                </Text>
              )}
            </>
          }
          renderItem={({ item }) =>
            moviesLoading ? <MovieLoadingCard /> : <MovieCard movie={item} />
          }
          ListEmptyComponent={
            !moviesLoading && !moviesError ? (
              <Text className="text-white text-center">No movies found</Text>
            ) : null
          }
        />
      </SafeAreaView>
  );
}