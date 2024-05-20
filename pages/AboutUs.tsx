import React from "react";
import { ArrowBack, ArrowForward, InfoOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { text } from "stream/consumers";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="aboutUs__mainContainer">
      <div className="aboutUs__left">
        <div className="aboutUs__desc">
          <p>
            <span className="aboutUs_detail">Welcome</span> to my internship
            project, a cutting-edge platform designed to streamline and enhance
            the management of job events and minion details within a network.
          </p>
          <p>
            During my internship, I developed this solution to provide an
            intuitive and efficient tool for monitoring and analyzing job
            activities across various nodes and minions.
          </p>
          <p>
            By leveraging the power of advanced filtering capabilities, and a
            user-friendly interface, this project aims to empower system
            administrators and IT professionals to gain deep insights into their
            infrastructure's performance and reliability.
          </p>
          <p>
            {" "}
            My commitment to innovation and excellence drives me to continuously
            improve this platform, ensuring it meets the evolving needs of its
            users. Thank you for exploring my project and its potential to
            optimize job event management processes.
          </p>
        </div>

        <div className="home__button">
          <Button variant="outlined" onClick={() => navigate("/")}>
            {" "}
            <ArrowBack sx={{ paddingRight: 1 }} /> Go Back
          </Button>
        </div>
      </div>
      <div className="home__image">
        <img src="/saltstack2.webp" />
      </div>
    </div>
  );
};

export default AboutUs;
