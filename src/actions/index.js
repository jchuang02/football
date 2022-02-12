import football from "../api/football";

export const fetchTeams = (id) => async (dispatch) => {
  const { data } = await football.get("/teams", {
    params: { id },
  });

  const theData = { teamInfo: data.response[0], lastUpdated: Date.now() };
  dispatch({ type: "FETCH_TEAMS", payload: theData });
};

export const updateTeams = (id) => async (dispatch) => {
  const { data } = await football.get("/teams", {
    params: { id },
  });

  const theData = { teamInfo: data.response[0], lastUpdated: Date.now() };
  dispatch({ type: "UPDATE_TEAMS", payload: theData });
};

export const fetchStandings = (league, season) => async (dispatch) => {
  const { data } = await football.get("/standings", {
    params: { league, season },
  });
  let theData;
  if (data.results > 0) {
    theData = { standingInfo: data.response[0], lastUpdated: Date.now() };
  } else {
    theData = {
      standingInfo: { league: { id: league, standings: [] } },
      lastUpdated: Date.now(),
    };
  }

  dispatch({ type: "FETCH_STANDINGS", payload: theData });
};

export const updateStandings = (league, season) => async (dispatch) => {
  const { data } = await football.get("/standings", {
    params: { league, season },
  });
  let theData;
  if (data.results > 0) {
    theData = { standingInfo: data.response[0], lastUpdated: Date.now() };
  } else {
    theData = {
      standingInfo: { league: { id: league, standings: [] } },
      lastUpdated: Date.now(),
    };
  }

  dispatch({ type: "UPDATE_STANDINGS", payload: theData });
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

export const fetchFixtures = (season, league) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { season, league },
  });
  const theData = {
    league: league,
    fixtureInfo: data.response,
    lastUpdated: Date.now(),
  };

  dispatch({ type: "FETCH_FIXTURES", payload: theData });
};

export const fetchUpcomingFixtures =
  (league, next = 12) =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { league, next },
    });

    const theData = {
      league: league,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };
    dispatch({ type: "FETCH__UPCOMING_FIXTURES", payload: theData });
  };

export const fetchPreviousFixtures =
  (league, last = 12) =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { league, last },
    });
    const theData = {
      league: league,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };
    dispatch({ type: "FETCH_PREVIOUS_FIXTURES", payload: theData });
  };

export const updateFixtures = (season, league) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { season, league },
  });

  const theData = {
    league: league,
    fixtureInfo: data.response,
    lastUpdated: Date.now(),
  };

  dispatch({ type: "UPDATE_FIXTURES", payload: theData });
};

export const updateLiveFixtures =
  (season, league, live = "all") =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { season, league, live },
    });

    if (data.results === 0) {
      console.log("No Live fixtures.");
      dispatch(
        updateFixtures(
          season,
          league,
          new Date(Date.parse(new Date()) - 604800000 * 2)
            .toISOString()
            .substring(0, 10),
          new Date(Date.parse(new Date()) + 604800000 * 2)
            .toISOString()
            .substring(0, 10)
        )
      );
    }

    const theData = {
      league: league,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };

    dispatch({ type: "UPDATE_LIVE_FIXTURES", payload: theData });
  };

export const updateLiveFixturesById = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  const theData = { fixtureInfo: data.response, lastUpdated: Date.now() };

  dispatch({ type: "UPDATE_LIVE_FIXTURES_BY_ID", payload: theData });
};

export const fetchFixture = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  dispatch({ type: "FETCH_FIXTURE", payload: data.response });
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

export const deleteEmail = (email) => {
  return { type: "DELETE_EMAIL", payload: email };
};

export const searchLeagues = (search) => async (dispatch) => {
  const { data } = await football.get("/leagues", {
    params: { search },
  });

  dispatch({ type: "SEARCH_LEAGUES", payload: data.response });
};

export const searchTeams = (search) => async (dispatch) => {
  const { data } = await football.get("/teams", {
    params: { search },
  });

  dispatch({ type: "SEARCH_TEAMS", payload: data.response });
};

export const searchReset = () => {
  return { type: "SEARCH_RESET", payload: "" };
};

export const setTerm = (term) => {
  return { type: "SET_TERM", payload: term };
};

export const resetTerm = () => {
  return { type: "RESET_TERM", payload: "" };
};

export const addFaveTeam = (id) => {
  return { type: "ADD_TEAM", payload: id };
};

export const addFaveLeague = (id) => {
  return { type: "ADD_LEAGUE", payload: id };
};

export const deleteFaveTeam = (id) => {
  return { type: "DELETE_TEAM", payload: id };
};

export const deleteFaveLeague = (id) => {
  return { type: "DELETE_LEAGUE", payload: id };
};

export const resetFollowed = () => {
  return { type: "RESET_FOLLOWED", payload: null };
};

export const fetchTeamFixtures = (team, season) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { team, season },
  });
  const theData = {
    team: team,
    fixtureInfo: data.response,
    lastUpdated: Date.now(),
  };
  dispatch({ type: "FETCH_TEAM_FIXTURES", payload: theData });
};

export const updateTeamFixtures = (team, season) => async (dispatch) => {
  const { data } = await football.get("fixtures", {
    params: { team, season },
  });

  const theData = {
    team: team,
    fixtureInfo: data.response,
    lastUpdated: Date.now(),
  };
  dispatch({ type: "UPDATE_TEAM_FIXTURES", payload: theData });
};

export const updateLiveTeamFixtures =
  (team, season, live = "all") =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { team, season, live },
    });

    if (data.results === 0) {
      console.log("No Live fixtures.");
      dispatch(updateTeamFixtures(team, season));
    }

    const theData = {
      team: team,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };

    dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES", payload: theData });
  };

export const updateLiveTeamFixturesById = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  const theData = { fixtureInfo: data.response, lastUpdated: Date.now() };

  dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES_BY_ID", payload: theData });
};
