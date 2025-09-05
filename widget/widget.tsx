import { images } from '@/constants/images';
import { FlexWidget, ImageWidget, ListWidget, TextWidget } from 'react-native-android-widget';

interface WidgetMovies {
  id: number;
  title: string;
  rating: string;
  image?: string;
}

export function TrendingWidget({movies} : {movies: WidgetMovies[]}) {

  movies = movies ? movies : [];

  return (
    <FlexWidget 
        style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: '#1a1a2e',
            borderWidth: 2,
            borderRadius: 12,
            borderColor: '#fff',
            overflow: 'hidden',
        }}>
        <TextWidget text="Trending Movies" style={{ 
          fontSize: 22, 
          color: '#ffffff', 
          padding: 10, 
          borderTopLeftRadius: 12, 
          borderTopRightRadius: 12, 
          backgroundColor: '#2c2c73', 
          width: 'match_parent' 
          }} />
        <ListWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
        }}
      >
        {movies.map((movie, index) => (
          <FlexWidget
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              width: 'match_parent'
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: `movieapp://movies/${movie.id}` }}
          >
            <ImageWidget 
              image={ 
                        movie.image ? `https://image.tmdb.org/t/p/w500${movie.image}`
                        : images.imageNotFound
                     }
              imageWidth={65}
              imageHeight={100}
              style={{
                borderWidth: 1,
                borderColor: '#fff'
              }}
              />
            <FlexWidget
              style={{
                marginLeft: 10,
                justifyContent: 'center',
              }}
            >
              <TextWidget text={movie.title} style={{ fontSize: 16, color: '#ffffff' }} />
              <TextWidget text={`Rating: ${movie.rating} / 10`} style={{ fontSize: 14, color: '#ffffff' }} />
            </FlexWidget>
          </FlexWidget>
        ))}
      </ListWidget>
    </FlexWidget>
  );
}