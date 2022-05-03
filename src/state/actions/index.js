import football from "../../api/football";

export const fetchTeams = (id) => async (dispatch) => {
  const { data } = await football.get("/teams", {
    params: { id },
  });

  const theData = {
    team: id,
    teamInfo: data.response[0],
    lastUpdated: Date.now(),
  };
  dispatch({ type: "FETCH_TEAMS", payload: theData });
};

export const updateTeams = (id) => async (dispatch) => {
  const { data } = await football.get("/teams", {
    params: { id },
  });

  const theData = {
    team: id,
    teamInfo: data.response[0],
    lastUpdated: Date.now(),
  };
  dispatch({ type: "UPDATE_TEAMS", payload: theData });
};

export const fetchTeamStats = (team, league, season) => async (dispatch) => {
  const { data } = await football.get("/teams/statistics", {
    params: { team, league, season },
  });

  dispatch({ type: "FETCH_TEAM_STATS", payload: data.response });
};

export const fetchTeamPlayers = (team, season, league) => async (dispatch) => {
  const { data } = await football.get("/players", {
    params: { team, season, league },
  });
  const pages = data.paging.total;
  let allPlayers = data.response;
  for (let i = 2; i <= pages; i++) {
    const { data } = await football.get("/players", {
      params: { team, season, league, page: i },
    });
    allPlayers = [...allPlayers, ...data.response];
  }
  dispatch({ type: "FETCH_TEAM_PLAYERS", payload: allPlayers });
};

export const selectLeague = (league) => {
  return { type: "SET_SELECTED_LEAGUE", payload: league };
};

export const selectTeam = (team) => {
  return { type: "SET_SELECTED_TEAM", payload: team };
};

export const setEmail = (email) => {
  return { type: "SET_EMAIL", payload: email };
};

export const deleteEmail = () => {
  return { type: "DELETE_EMAIL", payload: "" };
};
