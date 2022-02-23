import football from "../api/football";

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
      dispatch(updateTeamFixtures(team, season));
    }

    const theData = {
      team: team,
      fixtureInfo: data.response,
      lastUpdated: Date.now(),
    };

    dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES", payload: theData });
  };

export const updateLiveTeamFixturesById = (id, team) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  const theData = {
    team: team,
    fixtureInfo: data.response,
    lastUpdated: Date.now(),
  };

  dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES_BY_ID", payload: theData });
};
