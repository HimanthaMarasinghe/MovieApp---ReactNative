import { fetchSavedMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { FlatList, RefreshControl, Text } from "react-native";
import MovieCard from "./movieCard";

const MovieList = ({type} : {type : string}) => {

  const { data, loading, error : moviesError, refetch } = useFetch(() => fetchSavedMovies(type));
  return (
    <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'center',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="pb-32 px-5 mb-20"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}

          renderItem={({ item }) => <MovieCard movie={item} />}
          ListEmptyComponent={
            !loading && !moviesError ? (
              <Text className="text-white text-center">No favourite movies found</Text>
            ) : null
          }
        />
  );
};

export default MovieList;