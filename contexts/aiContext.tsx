import { appwriteFunction } from '@/services/appWrite';
import { createContext, Dispatch, RefObject, SetStateAction, useRef, useState } from 'react';

type AiContextType = {
    chatArr: Chat[];
    setChatArr: Dispatch<SetStateAction<Chat[]>>;
    inputText: string;
    setInputText: Dispatch<SetStateAction<string>>;
    waiting: boolean;
    sendMessage: () => Promise<void>;
    speakOutLoudNext : RefObject<boolean>
};

export const AiContext = createContext<AiContextType>({
    chatArr: [],
    setChatArr: () => {},
    inputText: '',
    setInputText: () => {},
    waiting: false,
    sendMessage: async () => {},
    speakOutLoudNext : useRef(false)
});

export const AiProvider = ({children} : { children: React.ReactNode }) => {
    const functionId = process.env.EXPO_PUBLIC_CHATWITH_AI_ID || '';

    const [chatArr, setChatArr] = useState<Chat[]>([]);
    const [inputText, setInputText] = useState('');
    const [waiting, setWaiting] = useState(false);
    const speakOutLoudNext = useRef(false);

    // Send message
    const sendMessage = async () => {
        if (!inputText.trim() || !functionId || waiting) return;
        setWaiting(true);

        const userMessage: Chat = {
        role: 'user',
        content: inputText,
        };
        const updatedChat = [...chatArr, userMessage];
        setChatArr(updatedChat);
        setInputText('');

        try {

        const payload = JSON.stringify({ chatHistory : updatedChat });
        const response = await appwriteFunction.createExecution(
            functionId,
            payload
        );
        if (response.responseStatusCode !== 200) {
            throw new Error(`Function execution failed with status: ${response.status}`);
        }
        
        const aiMessage: Chat = {
            role: 'model',
            content: response.responseBody,
        };
            setChatArr([...updatedChat, aiMessage]);
        } catch (err) {
            console.error('API error:', err);
        } finally {
            setWaiting(false);
        }
    };

    return (
        <AiContext.Provider value={{ chatArr, setChatArr, inputText, setInputText, waiting, sendMessage, speakOutLoudNext }}>
            {children}
        </AiContext.Provider>
    )
}