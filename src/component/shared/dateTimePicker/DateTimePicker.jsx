import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a custom theme
const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#a91d3a !important", // Selected day background color
            color: "white !important", // Selected day text color
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#5b0c1f !important", // Hover effect
            color: "white !important",
          },
        },
      },
    },
    MuiMultiSectionDigitalClockSection: {
      styleOverrides: {
        item: {
          "&.Mui-selected": {
            backgroundColor: "#a91d3a !important", // Selected time section background
            color: "white !important",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#5b0c1f !important", // Hover effect
            color: "white !important",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-textPrimary": {
            color: "#a91d3a !important",
            "&:hover": {
              backgroundColor: "#ACACAC !important",
              color: "white !important",
            },
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          "& .MuiButton-textPrimary": {
            color: "white",
            "&:hover": {
              backgroundColor: "#5b0c1f",
              color: "white !important",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ACACAC", // Default border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ACACAC", // Hover border color
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a91d3a", // Focused border color
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#6F6F6F",
          backgroundColor: "white",
          fontSize: "18px",
          "&.Mui-focused": {
            color: "#6F6F6F",
            fontSize: "18px",
            backgroundColor: "white",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ACACAC", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#ACACAC", // Hover border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "#a91d3a", // Focused border color
            },
          },
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        root: {
          "& .MuiClock-pin": {
            backgroundColor: "#a91d3a",
          },
          "& .MuiClock-pointer": {
            backgroundColor: "#a91d3a",
          },
          "& .MuiClock-pointerThumb": {
            backgroundColor: "#a91d3a", 
            borderColor: "#a91d3a",
          },
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: {
          backgroundColor: "#a91d3a", // Pointer color
        },
        thumb: {
          borderColor: "#a91d3a", // Circle color at the pointer's end
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#a91d3a", // Default color for icons
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            color: "#a91d3a", // Toolbar icons (clock/calendar) color
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#a91d3a", // Tab underline color
        },
      },
    },
  },
});

// Main component
const CustomDateTimePicker = ({ label, value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const handleChange = (newValue) => {
    setSelectedDate(newValue);
    onChange(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label={label}
          value={selectedDate}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} fullWidth variant="outlined" />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDateTimePicker;
