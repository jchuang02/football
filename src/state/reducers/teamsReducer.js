// eslint-disable-next-line import/no-anonymous-default-export
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_TEAMS":
      return {
        ...state,
        [action.payload.team]: action.payload,
      };
    case "UPDATE_TEAMS":
      return {
        ...state,
        [action.payload.team]: {
          teamInfo: action.payload.teamInfo,
          lastUpdated: action.payload.lastUpdated,
        },
      };
    case "FETCH_TEAM_STATS":
      return action.payload;
    default:
      return state;
  }
};
