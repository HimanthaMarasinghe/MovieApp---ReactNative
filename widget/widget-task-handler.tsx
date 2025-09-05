import { fetchTrendingMovies } from '@/services/api';
import { TrendingWidget } from '@/widget/widget';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

const nameToWidget = {
  // TMWidget will be the **name** with which we will reference our widget.
  TMWidget: TrendingWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      case 'WIDGET_UPDATE':
      case 'WIDGET_RESIZED':
      props.renderWidget(<Widget movies={[]} />);
      const trendingMovies = await fetchTrendingMovies();
      const filteredMovies = trendingMovies ? trendingMovies.map((movie : Movie) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_count ? `${(movie.vote_average).toFixed(1)} / 10` : 'N/A',
        image: movie.poster_path
      })) : [];
      props.renderWidget(<Widget movies={filteredMovies} />);
      break;



    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
        console.log("Widget clicked");
      // Not needed for now
      break;

    default:
      break;
  }
}