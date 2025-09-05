import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { TrendingWidget } from '@/widget/widget';

/**
 * This page is used to check the widget UI before building the production app.
 */
export default function TrendingWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <TrendingWidget movies={[
          { id: 1, title: "Nobody 2", rating: "7.1", image: "https://image.tmdb.org/t/p/w500/mEW9XMgYDO6U0MJcIRqRuSwjzN5.jpg" },
          { id: 2, title: "The Conjuring: Last Rites", rating: "7.7", image: "https://image.tmdb.org/t/p/w500/8XfIKOPmuCZLh5ooK13SPKeybWF.jpg" },
          { id: 3, title: "F1", rating: "7.8", image: "https://image.tmdb.org/t/p/w500/9PXZIUsSDh4alB80jheWX4fhZmy.jpg" }
        ]} />}
        width={320}
        height={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
});