/* eslint-disable import/no-anonymous-default-export */
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_LEAGUES":
      return {
        ...state,
        [action.payload.league]: action.payload,
      };
    case "UPDATE_LEAGUES":
      return {
        ...state,
        [action.payload.league]: {
          leagueInfo: action.payload.leagueInfo,
          lastUpdated: action.payload.lastUpdated,
        },
      };
    default:
      return state;
  }
};
