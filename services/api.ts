import { Client, Functions } from "appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";


const client : Client = new Client()
    .setEndpoint('https://syd.cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject(PROJECT_ID);

const appwriteFunction = new Functions(client);

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

export { fetchMovieDetails, fetchMovies, fetchTrendingMovies };

