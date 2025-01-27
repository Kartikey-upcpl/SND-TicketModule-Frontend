import useSWR from "swr";
import { ticketSummaryAction } from "@/api/action/ticketAction";

const fetcher = async () => {
    const data = await ticketSummaryAction();
    return data;
}

export const useTicketSummary = () => {
    const { data, error, isLoading } = useSWR("fetchTicketSummary", fetcher)
    return {
        TicketSummary: data,
        isError: error,
        isLoading
    }
}