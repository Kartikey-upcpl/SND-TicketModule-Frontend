import React from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Column {
    header: string;
    accessor: string;
}

interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
    currentPage?: number;
    totalPages?: number;
    setCurrentPage?: (page: number) => void;
    limit?: number;
    setLimit?: (limit: number) => void;
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#F8F9FD",
        color: "#060606",
        fontWeight: "bold",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    [`&.${tableCellClasses.body}`]: {
        textAlign: "center",
        whiteSpace: "nowrap", // Prevent text wrapping in body cells
        overflow: "hidden", // Hide overflow text
        textOverflow: "ellipsis", // Add ellipsis for overflow text
        minWidth: "180px"
    },
}));



const MuiTable: React.FC<TableProps> = ({ columns, data, currentPage, totalPages, setCurrentPage, limit, setLimit }) => {
    return (
        <div className="py-5">
            <TableContainer style={{ overflowX: "auto" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.accessor}
                                    style={{ width: "150px" }} // Fix width for all columns
                                >
                                    {column.header}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell style={{ width: "150px" }}>
                                Actions
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column) => {
                                    const isTicketId = column.accessor === "ticketId";
                                    return (
                                        <TableCell key={column.accessor} style={{ textAlign: "center", fontSize: "12px" }}>
                                            {isTicketId ? (
                                                <Link href={`/tickets/${row[column.accessor]}`}>
                                                    <span
                                                        style={{
                                                            color: "#0CAF60",
                                                            border: "1px solid #0CAF60",
                                                            padding: "8px 8px",
                                                            borderRadius: "4px",
                                                            transition: "all 0.3s ease",
                                                            display: "inline-block",
                                                            cursor: "pointer", // Indicate clickable area
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            textTransform: "capitalize"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#0CAF60";
                                                            e.currentTarget.style.color = "white";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = "transparent";
                                                            e.currentTarget.style.color = "#0CAF60";
                                                        }}
                                                    >
                                                        {row[column.accessor]}
                                                    </span>
                                                </Link>
                                            ) : column.accessor === "issue" ? (
                                                <span
                                                    style={{
                                                        color: "white",
                                                        padding: "8px 8px",
                                                        borderRadius: "4px",
                                                        display: "inline-block",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        textTransform: "capitalize",
                                                        backgroundColor:
                                                            row[column.accessor] === "Missing"
                                                                ? "#f73208"
                                                                : row[column.accessor] === "Compensation"
                                                                    ? "#AC290D"
                                                                    : row[column.accessor] === "Replacement Pickup"
                                                                        ? "#1b19a4"
                                                                        : row[column.accessor] === "Part Replacement"
                                                                            ? "#a8159c"
                                                                            : row[column.accessor] === "Part Purchase"
                                                                                ? "#e0911a"
                                                                                : "transparent", // Default background if no match
                                                    }}
                                                >
                                                    {row[column.accessor]}
                                                </span>
                                            ) : column.accessor === "priority" ? (
                                                <span
                                                    style={{
                                                        color: "white",
                                                        padding: "8px 8px",
                                                        borderRadius: "4px",
                                                        display: "inline-block",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        textTransform: "capitalize",
                                                        backgroundColor:
                                                            row[column.accessor] === "Low"
                                                                ? "#20AFED"
                                                                : row[column.accessor] === "Medium"
                                                                    ? "#EEC419"
                                                                    : row[column.accessor] === "High"
                                                                        ? "#F10404"
                                                                        : "transparent",
                                                    }}
                                                >
                                                    {row[column.accessor]}
                                                </span>
                                            ) : column.accessor === "status" ? (
                                                <span
                                                    style={{
                                                        color: "white",
                                                        padding: "8px 8px",
                                                        borderRadius: "4px",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "inline-block",
                                                        textTransform: "capitalize",
                                                        backgroundColor:
                                                            row[column.accessor] === "Hold"
                                                                ? "#6C757D"
                                                                : row[column.accessor] === "Closed"
                                                                    ? "#0CAF60"
                                                                    : row[column.accessor] === "In-Progress"
                                                                        ? "#3EC9D6"
                                                                        : "transparent",
                                                    }}
                                                >
                                                    {row[column.accessor]}
                                                </span>
                                            ) : column.accessor === "createdAt" ? (
                                                new Date(row[column.accessor]).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })
                                            ) : (
                                                <span style={{ textTransform: "capitalize" }}>{row[column.accessor]}</span>
                                            )}
                                        </TableCell>
                                    );
                                })}
                                <TableCell style={{ textAlign: "center" }}>
                                    <Link href={`/tickets/${row?.ticketId}`}>
                                        <span
                                            style={{
                                                color: "#0CAF60",
                                                border: "1px solid #0CAF60",
                                                padding: "8px 8px",
                                                borderRadius: "4px",
                                                transition: "all 0.3s ease",
                                                display: "inline-block",
                                                cursor: "pointer", // Indicate clickable area
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                textTransform: "capitalize"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#0CAF60";
                                                e.currentTarget.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#0CAF60";
                                            }}
                                        >
                                            View Details
                                        </span>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Pagination Controls */}

            <div className="flex justify-end items-center space-x-2 mt-4">
                {/* Limit Selector Dropdown */}
                {setCurrentPage && (

                    <select
                        className="px-4 py-2 border rounded-lg text-[#0CAF60]"
                        value={limit}
                        onChange={(e) => {
                            const newLimit = parseInt(e.target.value, 10);

                            if (setLimit) {
                                setLimit(newLimit);
                            }

                            if (setCurrentPage) {
                                setCurrentPage(1); // Reset to first page when changing limit
                            }
                        }}
                    >
                        <option value="10">10 per page</option>
                        <option value="25">25 per page</option>
                        <option value="50">50 per page</option>
                        <option value="100">100 per page</option>
                    </select>
                )}

                {setCurrentPage && (
                    <button
                        className="px-4 py-2 border rounded-lg text-[#0CAF60] bg-gray-100"
                        disabled={currentPage === undefined || currentPage === 1}
                        onClick={() => {
                            if (currentPage !== undefined && setCurrentPage) {
                                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
                            }
                        }}
                    >
                        Previous
                    </button>
                )}
                {setCurrentPage && (
                    <span className="px-4 py-2  text-[#0CAF60]" >
                        Page {currentPage} of {totalPages}
                    </span>
                )}
                {/* Next Button */}
                {setCurrentPage && (
                    <button
                        className="px-4 py-2 border rounded-lg text-[#0CAF60] bg-gray-100"
                        disabled={currentPage === undefined || totalPages === undefined || currentPage >= totalPages}
                        onClick={() => {
                            if (currentPage !== undefined && totalPages !== undefined && setCurrentPage) {
                                setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages);
                            }
                        }}
                    >
                        Next
                    </button>
                )}
            </div>
        </div >
    );
};

export default MuiTable;
