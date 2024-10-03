import {createTheme} from "@mui/material/styles";

export const theme = createTheme(
    {
        typography: {
            fontFamily: ['Afacad Flux', 'sans-serif'].join(','),
            fontSize: 16,
            h2: {
                fontSize: "60px",
                fontWeight: "bold",
            }
        },
    }
)