/* eslint-disable import/no-anonymous-default-export */
export default (state = {}, action) => {
  switch (action.type) {
    //Competition Fixtures
    case "FETCH_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_ALL_LIVE_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_LIVE_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_LIVE_FIXTURES_BY_ID":
      return {
        ...state,
        ...action.payload,
      };
    //Team Fixtures
    case "FETCH_TEAM_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_TEAM_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_LIVE_TEAM_FIXTURES":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_LIVE_TEAM_FIXTURES_BY_ID":
      return {
        ...state,
        ...action.payload,
      };
    case "FIXTURE_ACTION_START":
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: action.payload.loading,
        },
      };
    case "FIXTURE_ACTION_END":
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: action.payload.loading,
        },
      };
    default:
      return state;
  }
};
