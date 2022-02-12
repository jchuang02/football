import { combineReducers } from "redux";
import leaguesReducer from "./leaguesReducer";
import playersReducer from "./playersReducer";
import standingsReducer from "./standingsReducer";
import teamsReducer from "./teamsReducer";
import fixturesReducer from "./fixturesReducer";
import fixtureReducer from "./fixtureReducer";
import selectedLeagueReducer from "./selectedLeagueReducer";
import emailReducer from "./emailReducer";
import searchReducer from "./searchReducer";
import termReducer from "./termReducer";
import followedReducer from "./followedReducer";
import teamFixturesReducer from "./teamFixturesReducer";
import selectedTeamReducer from "./selectedTeamReducer";

export default combineReducers({
  leagues: leaguesReducer,
  standings: standingsReducer,
  teams: teamsReducer,
  teamPlayers: playersReducer,
  fixtures: fixturesReducer,
  teamFixtures: teamFixturesReducer,
  fixture: fixtureReducer,
  selectedLeague: selectedLeagueReducer,
  selectedTeam: selectedTeamReducer,
  email: emailReducer,
  search: searchReducer,
  term: termReducer,
  followed: followedReducer,
});
