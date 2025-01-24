"use client"
import React, { useEffect, useState } from 'react'
import TicketModal from '@/components/Modals/CreateTicket';
import { TicketFormData } from '@/types/ticketType';
import { fetchTicketsAction } from '@/api/action/ticketAction';
import Table from '@/components/Tables/Table';
import { UserType } from '@/types/userType';
import { fetchUserAction } from '@/api/action/userAction';
const AllTickets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState<TicketFormData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filterAssignTo, setFilterAssignTo] = useState<string>("");
    const [assignees, setAssignees] = useState<UserType[]>([]);

    const columns = [
        { header: 'Customer', accessor: 'customer' },
        { header: 'Issue', accessor: 'issue' },
        { header: 'Description', accessor: 'description' },
        { header: 'Status', accessor: 'status' },
        { header: 'Priority', accessor: 'priority' },
        { header: 'Assigned To', accessor: 'assignTo' },
        { header: 'Created By', accessor: 'createdby' },
        { header: 'Created At', accessor: 'createdAt' },
    ];
    const handleCreate = (data: TicketFormData) => {
        setTickets((prev) => [...prev, data]); // Add the newly created ticket to the list
        setIsModalOpen(false);
    };
    // Fetch Tickets on Component Mount
    const fetchTickets = async (assignTo?: string) => {
        try {
            const ticketsData = await fetchTicketsAction(undefined, `tickets?assignTo=${assignTo || ""}`);
            setTickets(ticketsData);
            setError(null);
        } catch (error: any) {
            setError(error.message);
        }
    };
    useEffect(() => {
        fetchTickets(filterAssignTo);
    }, [filterAssignTo]);

    useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const UserData = await fetchUserAction()
                setAssignees(UserData)
            } catch (error: any) {
                console.log(error.message)
            }
        }
        fetchAllUser()
    }, []);

    return (
        <div className=''>
            <div className='bg-zinc-200 py-3 flex justify-between'>
                <div className="ml-4">
                    <select
                        name="issue"
                        value={filterAssignTo}
                        onChange={(e) => setFilterAssignTo(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Assigned User</option>
                        {assignees.map((user: UserType) => (
                            <option key={user._id} value={user?.username}>{user?.username}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='mr-4 bg-blue-400 p-2 rounded font-medium'>
                        Create a Ticket
                    </button>
                    <TicketModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCreate={handleCreate}
                    />
                </div>
            </div>
            <div>
                <div className="mt-4">
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {!error && tickets.length > 0 ? (
                        <Table columns={columns} data={tickets} />
                    ) : (
                        <p className="text-gray-600">No tickets available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllTickets
