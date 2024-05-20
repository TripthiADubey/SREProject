import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import AXIOS_CLIENT from "../utils/axios";
import { GET_MINIONS } from "../utils/Urls";

export default function MinionCard() {
  const [minions, setMinions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await AXIOS_CLIENT.get(GET_MINIONS);
        const data: string[] = res.data;
        const minionsSortedByName = data.sort((a, b) =>
          a.toUpperCase().localeCompare(b.toUpperCase())
        );

        setMinions(["All Minions", ...minionsSortedByName]);
      } catch (error) {
        console.error("Error fetching minions:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="minioncard_main">
      {minions.map((minion) => (
        <div key={minion}>
          <Card
            sx={{ Width: 350, Height: 350, margin: 2 }}
            onClick={() => navigate(`/minion/id/${minion}`)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image="/minion.jpeg"
                alt={minion}
              />
              <CardContent>
                <Typography gutterBottom variant="h3" component="div">
                  {minion}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", fontSize: "1rem" }}
                >
                  <span>Click to see the logs</span>
                  <ArrowForward sx={{ paddingLeft: 1 }} />
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      ))}
    </div>
  );
}
