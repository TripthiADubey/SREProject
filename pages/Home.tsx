import { ArrowForward, InfoOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home__mainContainer">
      <div className="home__left">
        <div className="home__desc">
          <span className="home__title">SaltStack</span> is a revolutionary
          approach to infrastructure management that replaces complexity with
          speed. It is simple enough to get running in minutes, scalable enough
          to manage tens of thousands of servers, and fast enough to communicate
          with each system in seconds.
        </div>

        <div className="home__button">
          <Button variant="outlined" onClick={() => navigate("/minions")}>
            {" "}
            Get Started <ArrowForward sx={{ paddingLeft: 1 }} />{" "}
          </Button>
          <Button
            variant="contained"
            sx={{ marginLeft: 3 }}
            onClick={() =>
              window.open("https://saltproject.io/index.html", "_blank")
            }
          >
            More Info
            <InfoOutlined sx={{ paddingLeft: 1 }} />
          </Button>
        </div>
      </div>
      <div className="home__image">
        <img src="/saltstack2.webp" />
      </div>
    </div>
  );
};

export default Home;
