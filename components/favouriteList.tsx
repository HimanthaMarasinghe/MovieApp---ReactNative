import { FlatList, RefreshControl } from "react-native";

const favouriteList = () => {
  return (
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
          
          renderItem={({ item }) => <MovieCard movie={item} />}
          ListEmptyComponent={
            !moviesLoading && !moviesError ? (
              <Text className="text-white text-center">No movies found</Text>
            ) : null
          }
        />
  );
};

export default favouriteList;
