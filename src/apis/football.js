import axios from "axios";

export default axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-rapidapi-key": `${process.env.REACT_APP_FOOTBALL_API_KEY}`,
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
});

