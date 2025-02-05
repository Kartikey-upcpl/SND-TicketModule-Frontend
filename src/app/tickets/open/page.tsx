"use client"

import React, { useEffect, useState } from 'react'
import { TicketFormData } from '@/types/ticketType';
import { fetchTicketsbyStatus } from '@/api/action/ticketAction';
import Table from '@/components/Tables/Table';
import { useUsers } from '@/hooks/useUsers';
import { UserType } from '@/types/userType';


interface assigneesType {
    count: number;
    users: UserType[]; // Fix: users is an array of UserType
}

const OpenTickets = () => {
    const [tickets, setTickets] = useState<TicketFormData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [assignees, setAssignees] = useState<assigneesType>();
    const { users, isLoading, isError } = useUsers();

    const [filters, setFilters] = useState({
        assignTo: "",
    });
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

    useEffect(() => {
        // When `users` is available, update `assignees`
        if (users) {
            setAssignees(users);
        }
    }, [users]);

    // Fetch Tickets on Component Mount
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setError(null);
                const openTickets = await fetchTicketsbyStatus("In-Progress", filters.assignTo, "tickets/status");

                // console.log("Tickets Data:", openTickets); // ✅ Debugging Log

                setTickets(openTickets?.tickets || []);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchTickets();
    }, [filters.assignTo]);


    return (
        <div className="mt-4 sm:px-10 px-6">
            <select
                name="assignTo"
                value={filters.assignTo}
                onChange={(e) => setFilters({ ...filters, assignTo: e.target.value })}
                className="sm:w-40 w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0caf60] text-[#293240]"
            >
                <option value="">Select Assigned User</option>
                {assignees?.users?.map((user: UserType) => (
                    <option key={user._id} value={user.username}>
                        {user.username}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500">Error: {error}</p>}
            {!error && tickets.length > 0 ? (
                <Table columns={columns} data={tickets} />
            ) : (
                <p className="text-gray-600">No tickets available.</p>
            )}
        </div>
    )
}

export default OpenTickets
