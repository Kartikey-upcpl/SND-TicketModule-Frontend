"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.css"; // Ensure this is imported
import Link from "next/link";
import { fetchUserAction } from "@/api/action/userAction";
import { UserType } from "@/types/userType";


interface assigneesType {
    count: number;
    users: UserType[]; // Fix: users is an array of UserType
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


export default function CompletedRefundsTable() {
    const [allUsers, setAllUsers] = useState<assigneesType>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const UserData = await fetchUserAction()
                setAllUsers(UserData)
                setLoading(false)
            } catch (error: any) {
                console.log(error.message)
            }
        }
        fetchAllUser()
    }, []);
    return (
        <div className="flex">
            <div className="w-full pt-16 pb-10 px-6">
                <div className="flex justify-end my-5">
                    <Link
                        className="bg-[#0caf60] text-white px-4 py-2 rounded hover:bg-[#b52547] transition duration-200"
                        href="/create-a-new-user" // Use onClick for handling navigation
                    >
                        Create a User
                    </Link>
                </div>
                {loading ? (
                    "Loading... "
                ) : allUsers?.users?.length === 0 ? (
                    <p className="text-center text-red-600 font-semibold text-4xl w-full p-4">
                        There are no User.
                    </p>
                ) : (
                    <>
                        <TableContainer component={Paper} style={{ overflowX: "auto" }}>
                            <Table aria-label="refund table" style={{ minWidth: 1200 }}>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "S.no",
                                            "User Name",
                                            "Full Name",
                                            "Email",
                                            "Role",
                                        ].map((heading) => (
                                            <StyledTableCell align="center" key={heading}>
                                                {heading}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allUsers?.users.map((request: any, index) => (
                                        <TableRow key={request._id}>
                                            <StyledTableCell align="center">
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {request.username}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {request.fullname}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {request.email}
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="center">
                                                {request.mobileNumber}
                                            </StyledTableCell> */}
                                            <StyledTableCell align="center">
                                                {request.role}
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </div>
        </div>
    );
}
