import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import pages from "../utils/routes";

function NavBar() {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Tripthi Dubey">
              <Link href="/">
                <IconButton
                  onClick={() => {}}
                  sx={{ paddingRight: 3, objectFit: "scale-down" }}
                >
                  <Avatar alt="logo" src="/saltStackLogo.png" />
                </IconButton>
              </Link>
            </Tooltip>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Salt-Stack
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                onClick={() => navigate(page.route)}
                key={page.key}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.key}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Tripthi Dubey">
              <IconButton
                onClick={() => {}}
                sx={{ p: 0, objectFit: "scale-down" }}
              >
                <Avatar alt="logo" src="/saltStackLogo.png" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
