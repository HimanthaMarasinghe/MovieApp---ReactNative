import { useEffect, useState } from 'react';

const useFetch = <T>(fetchFunction:() => Promise<T>, autoFetch = true ) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        } catch (error) {
            // @ts-ignore
            setError(error instanceof Error ? error : new Error('An unexpected error occurred'));
        } finally {
            setLoading(false);
        }
    }
    
    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch]);

    return { data, setData, loading, error, refetch: fetchData, reset };
}

export default useFetch;
