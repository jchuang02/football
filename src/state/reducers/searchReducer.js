/* eslint-disable import/no-anonymous-default-export */
export default (
  state = { results: [], loading: false, errMsg: false },
  action
) => {
  switch (action.type) {
    case "SEARCH_TEAMS":
      return { ...state, results: action.payload };
    case "SEARCH_LEAGUES":
      return { ...state, results: action.payload };
    case "SEARCH_RESET":
      return { ...state, results: action.payload };
    case "SEARCH_ACTION_START":
      return { ...state, loading: action.payload };
    case "SEARCH_ACTION_END":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
