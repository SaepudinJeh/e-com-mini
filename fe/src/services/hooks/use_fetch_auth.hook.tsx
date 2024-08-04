import { useState, useEffect, useContext } from 'react';

import axios, { AxiosRequestConfig } from 'axios';
import { AuthContext } from '../../libs/contexts/auth.context';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001'
});

interface FetchResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    status: number | null;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
}

const useFetchWithAuth = <T,>({ path, options }: { path: string, options?: AxiosRequestConfig }): FetchResult<T> => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate()

    if (!authCtx?.authData?.token) {
        authCtx?.logout()
        navigate('/auth/login')
    }

    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchData = async () => {
        if (isFetching) {
            setLoading(true);
            try {
                const response = await axiosInstance.request<T>({
                    url: path,
                    headers: {
                        Authorization: `Bearer ${authCtx?.authData?.token}`,
                    },
                    ...options
                });
                
                setStatus(response.status)
                setData(response.data);
            } catch (err) {
                console.log(error);
                
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        navigate('/auth/login');
                    } else {
                        setError(err as Error);
                    }
                } else {
                    setError(err as Error);
                }
            } finally {
                setIsFetching(false);
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if(isFetching) {
            fetchData()
        }
    }, [isFetching])

    return { data, error, loading, setIsFetching, status };
};

export default useFetchWithAuth;
