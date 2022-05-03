import football from "../../api/football";

export const fetchFixtures = (season, league) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { season, league },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "FETCH_FIXTURES", payload: fixtures });
};

export const updateFixtures = (season, league) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { season, league },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: null,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_FIXTURES", payload: fixtures });
};

export const updateAllLiveFixtures =
  (live = "all") =>
    async (dispatch, getState) => {
      const { data } = await football.get("/fixtures", {
        params: { live },
      });
      let fixtures = {};
      data.response.forEach((fixture) => {
        if (
          getState().followed.leagues.includes(fixture.league.id) ||
          getState().followed.teams.includes(fixture.teams.away.id) ||
          getState().followed.teams.includes(fixture.teams.home.id)
        ) {
          fixtures[fixture.fixture.id] = {
            ...fixture,
            lastUpdated: Date.now(),
            loading: false,
            errors: data.errors,
          };
        }
      });

      dispatch({ type: "UPDATE_ALL_LIVE_FIXTURES", payload: fixtures });
    };

export const updateLiveFixtures =
  (season, league, live = "all") =>
    async (dispatch) => {
      const { data } = await football.get("/fixtures", {
        params: { season, league, live },
      });

      let fixtures = {};
      data.response.forEach((fixture) => {
        fixtures[fixture.fixture.id] = {
          ...fixture,
          lastUpdated: Date.now(),
          loading: false,
          errors: data.errors,
        };
      });

      dispatch({ type: "UPDATE_LIVE_FIXTURES", payload: fixtures });
    };

export const updateLiveFixturesById = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_LIVE_FIXTURES_BY_ID", payload: fixtures });
};

export const fetchTeamFixtures = (team, season) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { team, season },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "FETCH_TEAM_FIXTURES", payload: fixtures });
};

export const updateTeamFixtures = (team, season) => async (dispatch) => {
  const { data } = await football.get("fixtures", {
    params: { team, season },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_TEAM_FIXTURES", payload: fixtures });
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

      let fixtures = {};
      data.response.forEach((fixture) => {
        fixtures[fixture.fixture.id] = {
          ...fixture,
          lastUpdated: Date.now(),
          loading: false,
          errors: data.errors,
        };
      });

      dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES", payload: fixtures });
    };

export const updateLiveTeamFixturesById = (id) => async (dispatch) => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "UPDATE_LIVE_TEAM_FIXTURES_BY_ID", payload: fixtures });
};

export const fetchMatch = (id) => async dispatch => {
  const { data } = await football.get("/fixtures", {
    params: { id },
  });

  let fixtures = {};
  data.response.forEach((fixture) => {
    fixtures[fixture.fixture.id] = {
      ...fixture,
      lastUpdated: Date.now(),
      loading: false,
      errors: data.errors,
    };
  });

  dispatch({ type: "FETCH_FIXTURE", payload: fixtures });
}