import useSWR from "swr";
import { fetchUserAction } from "@/api/action/userAction";

// Fetcher function for SWR
const fetcher = async () => {
    const data = await fetchUserAction();
    return data;
};

export const useUsers = () => {
    const { data, error, isLoading } = useSWR("fetchUsers", fetcher);

    return {
        users: data,
        isLoading,
        isError: error,
    };
};
