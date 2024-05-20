import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";


const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  marginTop: "200px",
}));

const DataGridOverlay = () => {
  return (
      <StyledGridOverlay>
        <img
          src="/saltStackLogo.png"
          width={"auto"}
          height={"60%"}
          alt="logo"
        />
        <Box sx={{ mt: 2 }}>No Rows</Box>
      </StyledGridOverlay>
  );
};

export default DataGridOverlay;
