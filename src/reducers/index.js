import { combineReducers } from "redux";
import leaguesReducer from "./leaguesReducer";
import playersReducer from "./playersReducer";
import standingsReducer from "./standingsReducer";
import TeamReducer from "./TeamReducer";
import fixturesReducer from "./fixturesReducer";
import fixtureReducer from "./fixtureReducer";
import selectedLeagueReducer from "./selectedLeagueReducer";
import emailReducer from "./emailReducer";

export default combineReducers({
  leagues: leaguesReducer,
  standings: standingsReducer,
  teamStats: TeamReducer,
  teamPlayers: playersReducer,
  fixtures: fixturesReducer,
  fixture: fixtureReducer,
  selectedLeague: selectedLeagueReducer,
  email: emailReducer,
});
