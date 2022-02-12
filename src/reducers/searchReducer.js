/* eslint-disable import/no-anonymous-default-export */
export default (state = "", action) => {
  switch (action.type) {
    case "SEARCH_TEAMS":
      return action.payload;
    case "SEARCH_LEAGUES":
      return action.payload;
    case "SEARCH_RESET":
      return action.payload;
    default:
      return state;
  }
};
