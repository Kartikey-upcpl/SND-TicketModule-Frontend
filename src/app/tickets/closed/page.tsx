"use client"

import React, { useEffect, useState } from 'react'
import { TicketFormData } from '@/types/ticketType';
import { fetchTicketsAction } from '@/api/action/ticketAction';
import Table from '@/components/Tables/Table';

const ClosedTickets = () => {
    const [tickets, setTickets] = useState<TicketFormData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const columns = [
        { header: 'Customer', accessor: 'customer' },
        { header: 'Issue', accessor: 'issue' },
        // { header: 'Description', accessor: 'description' },
        { header: 'Status', accessor: 'status' },
        { header: 'Priority', accessor: 'priority' },
        { header: 'Assigned To', accessor: 'assignTo' },
        { header: 'Created By', accessor: 'createdby' },
        { header: 'Created At', accessor: 'createdAt' },
    ];

    // Fetch Tickets on Component Mount
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const closedTickets = await fetchTicketsAction('Closed', 'tickets/status', currentPage, limit);
                setTickets(closedTickets?.tickets || []);
                setTotalPages(closedTickets?.totalPages || 1);
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchTickets();
    }, [currentPage, limit]); // ✅ Refetch on page or limit change

    return (
        <div className="mt-4 xl:px-10 lg:px-20 px-6">
            {error && <p className="text-red-500">Error: {error}</p>}
            {!error && tickets.length > 0 ? (
                <Table
                    columns={columns}
                    data={tickets}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                />) : (
                <p className="text-gray-600">No tickets available.</p>
            )}
        </div>
    )
}

export default ClosedTickets
