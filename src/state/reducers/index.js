import { combineReducers } from "redux";
import leaguesReducer from "./leaguesReducer";
import playersReducer from "./playersReducer";
import standingsReducer from "./standingsReducer";
import teamsReducer from "./teamsReducer";
import fixturesReducer from "./fixturesReducer";
import selectedLeagueReducer from "./selectedLeagueReducer";
import emailReducer from "./emailReducer";
import searchReducer from "./searchReducer";
import followedReducer from "./followedReducer";
import selectedTeamReducer from "./selectedTeamReducer";

export default combineReducers({
  leagues: leaguesReducer,
  standings: standingsReducer,
  teams: teamsReducer,
  teamPlayers: playersReducer,
  fixtures: fixturesReducer,
  selectedLeague: selectedLeagueReducer,
  selectedTeam: selectedTeamReducer,
  email: emailReducer,
  search: searchReducer,
  followed: followedReducer,
});
