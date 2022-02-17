import football from "../api/football";

export const fetchTeamLeagues =
  (team, current = "true") =>
  async (dispatch) => {
    const { data } = await football.get("/leagues", {
      params: { team, current },
    });
    const theData = {
      team: team,
      leagueInfo: data.response,
      lastUpdated: Date.now(),
    };

    dispatch({ type: "FETCH_TEAM_LEAGUES", payload: theData });
  };

export const updateTeamLeagues =
  (team, current = "true") =>
  async (dispatch) => {
    const { data } = await football.get("/leagues", {
      params: { team, current },
    });

    const theData = {
      team: team,
      leagueInfo: data.response,
      lastUpdated: Date.now(),
    };

    dispatch({ type: "UPDATE_TEAM_LEAGUES", payload: theData });
  };
