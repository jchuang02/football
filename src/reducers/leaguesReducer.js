/* eslint-disable import/no-anonymous-default-export */
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_LEAGUES":
      return {
        ...state,
        [action.payload.leagueInfo.league.id]: action.payload,
      };
    case "UPDATE_LEAGUES":
      const id = action.payload.leagueInfo.league.id;
      return {
        ...state,
        [id]: {
          leagueInfo: action.payload.leagueInfo,
          lastUpdated: action.payload.lastUpdated,
        },
      };
    default:
      return state;
  }
};
