import football from "../api/football";

export const fetchTeamLeagues =
  (team, current = "true") =>
  async (dispatch, getState) => {
    const { data } = await football.get("/leagues", {
      params: { team, current },
    });
    let parsedLeagues = {};
    data.response.forEach((league) => {
      parsedLeagues[league.league.id] = {
        team:
          getState().leagues[league.league.id] &&
          getState().leagues[league.league.id].team
            ? [...getState().leagues[league.league.id].team, team]
            : [team],
        league: league,
        lastUpdated: Date.now(),
      };
    });

    dispatch({ type: "FETCH_TEAM_LEAGUES", payload: parsedLeagues });
  };

export const updateTeamLeagues =
  (team, current = "true") =>
  async (dispatch, getState) => {
    const { data } = await football.get("/leagues", {
      params: { team, current },
    });

    let parsedLeagues = {};
    data.response.forEach((league) => {
      parsedLeagues[league.league.id] = {
        team:
          getState().leagues[league.league.id] &&
          getState().leagues[league.league.id].team
            ? [...getState().leagues[league.league.id].team, team]
            : [team],
        league: league,
        lastUpdated: Date.now(),
      };
    });

    dispatch({ type: "UPDATE_TEAM_LEAGUES", payload: parsedLeagues });
  };
