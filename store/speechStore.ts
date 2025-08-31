import * as Speech from 'expo-speech';
import { create } from 'zustand';

interface SpeechState {
    speaking: boolean;
    startSpeaking: () => void;
    stopSpeaking: () => void;
}

export const useSpeechStore = create<SpeechState>((set) => ({
    speaking: false,
    startSpeaking: () => set({ speaking : true }),
    stopSpeaking: () => {
        Speech.stop();
        set({ speaking : false });
    }
}));
