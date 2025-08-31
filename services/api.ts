import { Models } from "appwrite";
import { Alert } from 'react-native';
import { appwriteFunction } from './appWrite';

const fetchMovies = async ({query}: {query: string}) => {
    try {
        const functionId : string = "68604e05002eb7fa2d47";
        const payload = JSON.stringify({ query });
        const response = await appwriteFunction.createExecution(
            functionId,
            payload
        );
        if (response.responseStatusCode !== 200) {
            throw new Error(`Function execution failed with status: ${response.status}`);
        }
        return JSON.parse(response.responseBody);
    } catch (error) {
        console.error("Error fetching movies from Appwrite Function:", error);
    }
}

const fetchTrendingMovies = async () => {
    try {
        const functionId = '6860ffc10024b4391bbf';
        const response = await appwriteFunction.createExecution(functionId);
        if (response.responseStatusCode !== 200) {
            throw new Error(`Function execution failed with status: ${response.status}`);
        };
        const data = JSON.parse(response.responseBody);
        if (data === 'False') {
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
    }
}

const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
    try {
        const functionId = '68610178001d5717bf70';
        const response = await appwriteFunction.createExecution(functionId, JSON.stringify({ id }));
        if (response.responseStatusCode !== 200) {
            throw new Error(`Failed to fetch movie details: ${response.status}`);
        }
        const data = JSON.parse(response.responseBody);
        if (!data) {
            throw new Error("Movie not found");
        }
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw error;
    }
}

const updateWatchState = async (movieId : number, watchState : number, setWatchState : React.Dispatch<React.SetStateAction<number>>, isLoggedIn : boolean) => {
    if (watchState < 0) return;
    setWatchState(-1);
    const FUNCTION_ID = process.env.EXPO_PUBLIC_SAVE_FUNCTION_ID;
    if (!FUNCTION_ID) {
        Alert.alert('Error', 'Function ID is not set');
        return;
    }
    if(!isLoggedIn) {
        Alert.alert("Log in to save movies");
        return;
    }

    try {
        const newWatchState = (watchState + 1) % 3;
        
        const execution: Models.Execution = await appwriteFunction.createExecution(
            FUNCTION_ID,
            JSON.stringify({ 'movieId': (movieId).toString(), state : newWatchState, listType : 'watchlist' })
        );
        console.log('Function execution started:', execution);
        if (execution.status === 'completed' && [200, 201].includes(execution.responseStatusCode)) {
            setWatchState(newWatchState);
        } else {
            console.error('Execution failed:', execution);
            Alert.alert('Error', 'Something went wrong');
        }
    } catch (error) {
        console.error(error);
    }
};

const updateFav = async (movieId : number, curFavourite : number, setFavourite : React.Dispatch<React.SetStateAction<number>>, isLoggedIn : boolean) => {
    if (curFavourite < 0) return;
    setFavourite(-1);
    const FUNCTION_ID = process.env.EXPO_PUBLIC_SAVE_FUNCTION_ID;
    if (!FUNCTION_ID) {
        Alert.alert('Error', 'Function ID is not set');
        return;
    }
    if(!isLoggedIn) {
        Alert.alert("Log in to save movies");
        return;
    }

    try {
        const favourite = (curFavourite + 1) % 2 === 1;

        const execution: Models.Execution = await appwriteFunction.createExecution(
            FUNCTION_ID,
            JSON.stringify({ 'movieId': (movieId).toString(), favourite, listType : "favourite" })
        );
        console.log('Function execution started:', execution);
        if (execution.status === 'completed' && [200, 201].includes(execution.responseStatusCode)) {
            setFavourite(favourite ? 1 : 0);
        } else {
            console.error('Execution failed:', execution);
            Alert.alert('Error', 'Something went wrong');
        }
    } catch (error) {
        console.error(error);
    }
}

const fetchWantToWatchMovies = async () => {
    
}

export { fetchMovieDetails, fetchMovies, fetchTrendingMovies, updateFav, updateWatchState };

