import { widgetTaskHandler } from '@/widget/widget-task-handler';
import 'expo-router/entry';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

registerWidgetTaskHandler(widgetTaskHandler);