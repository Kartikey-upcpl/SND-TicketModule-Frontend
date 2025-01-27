import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const DateRangeFilter: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}) => {
    return (
        <div className="flex w-72 space-x-2">
            <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => onStartDateChange(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select start date"
                customInput={
                    <TextField
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    📅 {/* You can use any icon here */}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "40px", // Custom height
                                padding: "0 ", // Custom padding
                            },
                        }}
                    />
                }
                className="h-10 p-0 rounded bg-white "
            />
            <div className="flex items-center text-grey">To</div>
            <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => onEndDateChange(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select end date"
                customInput={
                    <TextField
                        fullWidth
                        variant="outlined" // Specify the variant (outlined, filled, standard)
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    📅 {/* Replace with any icon or component */}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "40px", // Custom height
                                padding: "0 ", // Custom padding
                            },
                        }}
                    />
                }
                className=" rounded bg-white"
            />
        </div>
    );
};

export default DateRangeFilter;
