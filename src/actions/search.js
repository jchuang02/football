import football from "../api/football";

export const searchLeagues = (search) => async (dispatch) => {
  dispatch(searchActionStart());

  const { data } = await football.get("/leagues", {
    params: { search },
  });

  dispatch({ type: "SEARCH_LEAGUES", payload: data.response });
  dispatch(searchActionEnd());
};

export const searchTeams = (search) => async (dispatch) => {
  dispatch(searchActionStart());
  const { data } = await football.get("/teams", {
    params: { search },
  });

  dispatch({ type: "SEARCH_TEAMS", payload: data.response });
  dispatch(searchActionEnd());
};

export const searchReset = () => {
  return { type: "SEARCH_RESET", payload: [] };
};

export const searchActionStart = () => {
  return { type: "SEARCH_ACTION_START", payload: true };
};

export const searchActionEnd = () => {
  return { type: "SEARCH_ACTION_END", payload: false };
};
