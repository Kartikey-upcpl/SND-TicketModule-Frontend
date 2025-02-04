"use client"

import React, { useEffect, useState } from 'react'
import { TicketFormData } from '@/types/ticketType';
import { fetchPriorityTicketsAction } from '@/api/action/ticketAction';
import Table from '@/components/Tables/Table';

const PriorityTickets = () => {
    const [tickets, setTickets] = useState<TicketFormData[]>([]);
    const [error, setError] = useState<string | null>(null);

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
                const priorityTickets = await fetchPriorityTicketsAction("Medium");
                setTickets(priorityTickets?.tickets);
            } catch (error: any) {
                setError(error.message);
            }
        };
        fetchTickets();
    }, []);

    return (
        <div className="mt-4 xl:px-10 lg:px-20 px-6">
            {error && <p className="text-red-500">Error: {error}</p>}
            {!error && tickets.length > 0 ? (
                <Table columns={columns} data={tickets} />
            ) : (
                <p className="text-gray-600">No tickets available.</p>
            )}
        </div>
    )
}

export default PriorityTickets
