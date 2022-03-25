import football from "../api/football";

export const fetchStandings = (league, season) => async (dispatch) => {
  const { data } = await football.get("/standings", {
    params: { league, season },
  });
  let theData;
  if (data.response.length > 0) {
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
  if (data.response.length > 0) {
    theData = { standingInfo: data.response[0], lastUpdated: Date.now() };
  } else {
    theData = {
      standingInfo: { league: { id: league, standings: [] } },
      lastUpdated: Date.now(),
    };
  }
  dispatch({ type: "UPDATE_STANDINGS", payload: theData });
};
