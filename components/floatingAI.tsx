import { AiContext } from '@/contexts/aiContext';
import { useSpeechStore } from '@/store/speechStore';
import { FontAwesome6 } from '@expo/vector-icons';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Screen dimensions
const { width, height } = Dimensions.get('window');

const FloatingAI: React.FC = () => {
    // Store
    const { speaking, stopSpeaking } = useSpeechStore();

    // State & Refs
    const speakingRef = useRef(speaking);
    const [listening, setListening] = useState(false);
    const [labelSide, setLabelSide] = useState<"left" | "right">("left");

    const { setInputText, sendMessage, speakOutLoudNext } = useContext(AiContext);

    const hidden = useRef(false);
    const moved = useRef(false);
    const listeningRef = useRef(listening);

    const position = useRef(new Animated.ValueXY({ x: width - 70, y: height / 2 })).current;
    const scale = useRef(new Animated.Value(1)).current;

    const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
    const listenTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Helper functions ---
    // Hiding the button after 5 seconds
    const startTimer = () => {
        if (timerId.current) clearTimeout(timerId.current);

        timerId.current = setTimeout(() => {
            const newX = position.x._value > width / 2 ? width - 20 : -50;
            Animated.timing(position, {
                toValue: { x: newX, y: position.y._value },
                duration: 300,
                useNativeDriver: false,
            }).start();
            hidden.current = true;
        }, 5000);
    };

    const bringBack = () => {
        const newX = position.x._value > width / 2 ? width - 70 : 0;
        Animated.spring(position, {
            toValue: { x: newX, y: position.y._value },
            useNativeDriver: false,
        }).start();
        hidden.current = false;
    };

    const buttonPress = () => {
        if (hidden.current) {
            bringBack();
            startTimer();
        } else {
            if (speakingRef.current) stopSpeaking();
        }
    };

    const startListenTimer = () => {
        if (listenTimerId.current) clearTimeout(listenTimerId.current);

        listenTimerId.current = setTimeout(() => {
            if (!moved.current) handleStart();
        }, 1000);
    };

    // --- Effects ---
    
    useEffect(() => {
        speakingRef.current = speaking;
        if (speaking) {
            bringBack();
            clearTimeout(timerId.current!);
        }
        else startTimer();
    }, [speaking]);


    useEffect(() => {
        if (listening) {
            Animated.spring(scale, { toValue: 1.5, useNativeDriver: false }).start();
        } else {
            Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start();
        }
    }, [listening]);

    useEffect(() => {
        startTimer();
        const listenerId = position.x.addListener(({ value }) => {
            setLabelSide(value > width / 2 ? "left" : "right");
        });
        return () => {
            position.x.removeListener(listenerId);
            timerId.current && clearTimeout(timerId.current);
        }
    }, []);

    useEffect(() => {
        listeningRef.current = listening;
    }, [listening]);

    // --- PanResponder ---
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                moved.current = false;
                if (!speakingRef.current) startListenTimer();
            },

            onPanResponderMove: (_, gesture) => {
                if (Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5) {
                    moved.current = true;
                }
                position.setValue({ x: gesture.moveX - 35, y: gesture.moveY - 35 });
            },

            onPanResponderRelease: (_, gesture) => {
                const newX = gesture.moveX > width / 2 ? width - 70 : 0;
                const newY = gesture.moveY > (height - 100)
                    ? height - 100
                    : gesture.moveY < 100
                        ? 100
                        : gesture.moveY;

                Animated.spring(position, {
                    toValue: { x: newX, y: newY - 35 },
                    useNativeDriver: false,
                }).start();

                if (!speakingRef.current) startTimer();
                clearTimeout(listenTimerId.current!);
                if (listeningRef.current) {
                    ExpoSpeechRecognitionModule.stop();
                }

                if (!moved.current) buttonPress();
            },
        })
    ).current;

    // Listning functionalities
    useSpeechRecognitionEvent("start", () => setListening(true));
    useSpeechRecognitionEvent("end", () => {
        setListening(false);
        speakOutLoudNext.current = true;
        sendMessage();
        setListening(false);
    });
    useSpeechRecognitionEvent("result", (event) => {
        setInputText(event.results[0]?.transcript);
    });
    useSpeechRecognitionEvent("error", (event) => {
        console.log("error code:", event.error, "error message:", event.message);
    });

    const handleStart = async () => {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
        console.warn("Permissions not granted", result);
        return;
        }
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: true,
        });
    };


    // --- Render ---
    return (
        <Animated.View
            style={[styles.button, position.getLayout(), { transform: [{ scale }] }]}
            {...panResponder.panHandlers}
            className={`${listening ? 'bg-green-400' : 'bg-red-400'}`}
        >
            <TouchableOpacity style={styles.touchableArea}>
                {speaking ? (
                    <FontAwesome6 name="pause" size={30} color="white" />
                ) : (
                    <FontAwesome6 name="microphone-lines" size={30} color="white" />
                )}

                {listening && (
                    <View
                        className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-md p-1 justify-center items-center ${
                            labelSide === "left" ? "-left-20" : "-right-20"
                        }`}
                    >
                        <Text className="text-sm font-bold text-black">Listening</Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        position: 'absolute',
        zIndex: 1000,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableArea: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FloatingAI;