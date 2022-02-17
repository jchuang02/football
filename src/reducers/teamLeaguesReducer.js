/* eslint-disable import/no-anonymous-default-export */
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_TEAM_LEAGUES":
      return {
        ...state,
        [action.payload.team]: action.payload,
      };
    case "UPDATE_TEAM_LEAGUES":
      return {
        ...state,
        [action.payload.team]: action.payload,
      };
    default:
      return state;
  }
};
