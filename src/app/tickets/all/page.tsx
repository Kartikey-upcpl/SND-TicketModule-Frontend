"use client"
import React, { useEffect, useState } from 'react'
import TicketModal from '@/components/Modals/CreateTicket';
import { TicketFormData } from '@/types/ticketType';
import { fetchTicketsAction } from '@/api/action/ticketAction';
import Table from '@/components/Tables/Table';
import DateRangeFilter from '@/components/DateFilter/DateRangeFilter';
import { UserType } from '@/types/userType';
import { useUsers } from '@/hooks/useUsers';
import { Tooltip } from '@mui/material';
import { ToastContainer } from 'react-toastify';
interface assigneesType {
    count: number;
    users: UserType[]; // Fix: users is an array of UserType
}



const AllTickets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState<TicketFormData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { users, isLoading, isError } = useUsers();
    const [assignees, setAssignees] = useState<assigneesType>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        assignTo: "",
        email: "",
        mobileNo: "",
        orderId: "",
        startDate: "",
        endDate: ""
    });
    const columns = [
        { header: 'Ticket Id', accessor: 'ticketId' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Email', accessor: 'email' },
        { header: 'Issue', accessor: 'issue' },
        { header: 'Assigned To', accessor: 'assignTo' },
        { header: 'Status', accessor: 'status' },
        { header: 'Priority', accessor: 'priority' },
        { header: 'Marketplace', accessor: 'marketplace' },
        { header: 'Mobile No', accessor: 'mobileNo' },
        { header: 'Created By', accessor: 'createdby' },
        { header: 'Created At', accessor: 'createdAt' },
    ];
    const handleCreate = (data: TicketFormData) => {
        setTickets((prev) => [...prev, data]); // Add the newly created ticket to the list
        setIsModalOpen(false);
    };
    // Utility function to format date as YYYY-MM-DD
    const formatDate = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Fetch Tickets on Component Mount
    const fetchTickets = async (page = 1, limitSize = limit) => {
        try {
            const formattedFilters = {
                ...filters,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                page,  // Include page number
                limit: limitSize, // Fetch 10 tickets per request
            };
            // Build the query string dynamically based on filters
            const queryString = new URLSearchParams(
                Object.entries(formattedFilters).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) acc[key] = String(value);
                    return acc;
                }, {} as Record<string, string>)
            ).toString();

            const response = await fetchTicketsAction(undefined, `tickets?${queryString}`);
            setTickets(response.tickets);
            setTotalPages(response.totalPages);
            setCurrentPage(response.currentPage);
            setError(null);
        } catch (error: any) {
            console.log("errorrrr", error)
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchTickets(currentPage, limit);
    }, [filters, currentPage, limit]);

    useEffect(() => {
        // When `users` is available, update `assignees`
        if (users) {
            setAssignees(users);
        }
    }, [users]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching users.</div>;

    return (
        <div className='py-2 xl:px-10 lg:px-20 px-6'>
            {/* Filters Section */}
            <div className=" py-4 text-[#293240] flex flex-wrap gap-4">
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
                <input
                    type="text"
                    placeholder="Email"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    className="sm:w-40 w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0caf60] text-[#293240]"
                />
                <input
                    type="text"
                    placeholder="Mobile No"
                    value={filters.mobileNo}
                    onChange={(e) => setFilters({ ...filters, mobileNo: e.target.value })}
                    className="sm:w-40 w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0caf60] text-[#293240]"
                />
                <input
                    type="text"
                    placeholder="Order ID"
                    value={filters.orderId}
                    onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                    className="sm:w-40 w-full h-10 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0caf60] text-[#293240]"
                />
                <DateRangeFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={(date) => {
                        setStartDate(date);
                        setFilters((prev) => ({ ...prev, startDate: formatDate(date) }));
                    }}
                    onEndDateChange={(date) => {
                        setEndDate(date);
                        setFilters((prev) => ({ ...prev, endDate: formatDate(date) }));
                    }}
                />
                <div className="w-full sm:w-auto ">
                    <Tooltip title="Create Ticket" arrow>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#0caF60] hover:bg-[#258758] p-2 text-white  rounded  font-medium transition duration-200 w-full relative"
                        >
                            Create Ticket +
                        </button>
                    </Tooltip>
                    <TicketModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCreate={handleCreate}
                    />
                </div>
            </div>

            <div className="mt-4">
                {error && <p className="text-red-500">Error: {error}</p>}
                {!error && tickets?.length > 0 ? (
                    <Table columns={columns} data={tickets} currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit} />
                ) : (
                    <p className="text-gray-600">No tickets available.</p>
                )}
            </div>
        </div>
    )
}

export default AllTickets
