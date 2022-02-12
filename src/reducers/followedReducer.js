/* eslint-disable import/no-anonymous-default-export */
export default (state = { teams: [], leagues: [] }, action) => {
  switch (action.type) {
    case "ADD_TEAM":
      return {
        teams: [...state.teams, action.payload],
        leagues: state.leagues,
      };
    case "ADD_LEAGUE":
      return {
        teams: state.teams,
        leagues: [...state.leagues, action.payload],
      };
    case "DELETE_TEAM":
      return {
        teams: state.teams.filter((team) => {
          return team !== action.payload;
        }),
        leagues: state.leagues,
      };

    case "DELETE_LEAGUE":
      return {
        teams: state.teams,
        leagues: state.leagues.filter((team) => {
          return team !== action.payload;
        }),
      };
    case "RESET_FOLLOWED":
      return { teams: [], leagues: [] };
    default:
      return state;
  }
};
