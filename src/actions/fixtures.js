import football from "../api/football";

export const fetchFixtures = (season, league) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { season, league },
  });

  let parsedMatches = {};
  data.response.forEach((match) => {
    parsedMatches[match.fixture.id] = {
      ...match,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "FETCH_FIXTURES", payload: parsedMatches });
};

export const updateFixtures = (season, league) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { season, league },
  });

  let parsedMatches = {};
  data.response.forEach((match) => {
    parsedMatches[match.fixture.id] = {
      ...match,
      lastUpdated: Date.now(),
      loading: null,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_FIXTURES", payload: parsedMatches });
};

export const updateAllLiveFixtures =
  (live = "all") =>
  async (dispatch, getState) => {
    const { data } = await football.get("/fixtures", {
      params: { live },
    });
    let parsedMatches = {};
    data.response.forEach((match) => {
      if (
        getState().followed.leagues.includes(match.league.id) ||
        getState().followed.teams.includes(match.teams.away.id) ||
        getState().followed.teams.includes(match.teams.home.id)
      ) {
        parsedMatches[match.fixture.id] = {
          ...match,
          lastUpdated: Date.now(),
          loading: false,
          errors: data.errors,
        };
      }
    });

    dispatch({ type: "UPDATE_ALL_LIVE_FIXTURES", payload: parsedMatches });
  };

export const updateLiveFixtures =
  (season, league, live = "all") =>
  async (dispatch) => {
    const { data } = await football.get("/fixtures", {
      params: { season, league, live },
    });

    let parsedMatches = {};
    data.response.forEach((match) => {
      parsedMatches[match.fixture.id] = {
        ...match,
        lastUpdated: Date.now(),
        loading: false,
        errors: data.errors,
      };
    });

    dispatch({ type: "UPDATE_LIVE_FIXTURES", payload: parsedMatches });
  };

export const updateLiveFixturesById = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  let parsedMatches = {};
  data.response.forEach((match) => {
    parsedMatches[match.fixture.id] = {
      ...match,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_LIVE_FIXTURES_BY_ID", payload: parsedMatches });
};

export const fetchTeamFixtures = (team, season) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { team, season },
  });

  let parsedMatches = {};
  data.response.forEach((match) => {
    parsedMatches[match.fixture.id] = {
      ...match,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "FETCH_TEAM_FIXTURES", payload: parsedMatches });
};

export const updateTeamFixtures = (team, season) => async (dispatch) => {
  const { data } = await football.get("fixtures", {
    params: { team, season },
  });

  let parsedMatches = {};
  data.response.forEach((match) => {
    parsedMatches[match.fixture.id] = {
      ...match,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_TEAM_FIXTURES", payload: parsedMatches });
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

    let parsedMatches = {};
    data.response.forEach((match) => {
      parsedMatches[match.fixture.id] = {
        ...match,
        lastUpdated: Date.now(),
        loading: false,
        errors: data.errors,
      };
    });

    dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES", payload: parsedMatches });
  };

export const updateLiveTeamFixturesById = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  let parsedMatches = {};
  data.response.forEach((match) => {
    parsedMatches[match.fixture.id] = {
      ...match,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES_BY_ID", payload: parsedMatches });
};
