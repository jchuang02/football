import football from "../api/football";

export const fetchLeagues =
  (id, current = "true") =>
  async (dispatch) => {
    const { data } = await football.get("/leagues", {
      params: { id, current },
    });
    const theData = { leagueInfo: data.response[0], lastUpdated: Date.now() };

    dispatch({ type: "FETCH_LEAGUES", payload: theData });
  };

export const fetchSearchLeagues = (search) => async (dispatch) => {
  const { data } = await football.get("/leagues", {
    params: { search },
  });
  const theData = { leagueInfo: data.response[0], lastUpdated: Date.now() };

  dispatch({ type: "FETCH_SEARCH_LEAGUES", payload: theData });
};

export const updateLeagues =
  (id, current = "true") =>
  async (dispatch) => {
    const { data } = await football.get("/leagues", {
      params: { id, current },
    });
    const theData = { leagueInfo: data.response[0], lastUpdated: Date.now() };
    dispatch({ type: "UPDATE_LEAGUES", payload: theData });
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
  let theData = {
    league: league,
    fixtureInfo: data.response,
    lastUpdated: Date.now(),
  };

  dispatch({ type: "FETCH_FIXTURES", payload: theData });
};

export const fetchUpcomingFixtures =
  (season, league, next = 12) =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { season, league, next },
    });

    let theData = {
      league: league,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };
    dispatch({ type: "FETCH_FIXTURES", payload: theData });
  };

export const fetchPreviousFixtures =
  (season, league, last = 12) =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { season, league, last },
    });
    let theData = {
      league: league,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };
    dispatch({ type: "FETCH_FIXTURES", payload: theData });
  };

export const updateFixtures =
  (season, league, from, to) => async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { season, league, from, to },
    });

    let theData = {
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
  return { type: "SET_SELECTED", payload: league };
};
