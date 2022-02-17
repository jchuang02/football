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
import followedReducer from "./followedReducer";
import teamFixturesReducer from "./teamFixturesReducer";
import selectedTeamReducer from "./selectedTeamReducer";
import teamLeaguesReducer from "./teamLeaguesReducer";

export default combineReducers({
  leagues: leaguesReducer,
  teamLeagues: teamLeaguesReducer,
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
  followed: followedReducer,
});
