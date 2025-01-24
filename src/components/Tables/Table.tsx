import React from 'react';
import { useRouter } from 'next/navigation'; // For navigation in Next.js
import Link from 'next/link';


interface Column {
    header: string;
    accessor: string;
}

interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {

    return (
        <table className="w-full border-collapse border border-gray-200">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.accessor} className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
                            {column.header}
                        </th>
                    ))}
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Actions</th>

                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                        {columns.map((column) => (
                            <td key={column.accessor} className="border border-gray-300 px-4 py-2">
                                {column.accessor === "createdAt"
                                    ? row[column.accessor]
                                        .slice(0, 10) // Extract the date part (YYYY-MM-DD)
                                        .split("-") // Split into [YYYY, MM, DD]
                                        .reverse() // Reverse to [DD, MM, YYYY]
                                        .join("-") // Join into DD-MM-YYYY format
                                    : row[column.accessor]}
                            </td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2">
                            <Link
                                href={`/tickets/${row.ticketId}`}
                                className="text-blue-500 hover:underline"
                            >
                                View Details
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
