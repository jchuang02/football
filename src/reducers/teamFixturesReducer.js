// eslint-disable-next-line import/no-anonymous-default-export
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_TEAM_FIXTURES":
      return {
        ...state,
        [action.payload.team]: action.payload,
      };
    case "UPDATE_TEAM_FIXTURES":
      const currentFixturesWithEvents = state[
        action.payload.team
      ].fixtureInfo.filter((fixture) => {
        return fixture.events;
      });
      if (currentFixturesWithEvents.length === 0) {
        return {
          ...state,
          [action.payload.team]: action.payload,
        };
      } else {
        const newFixturesArray = action.payload.fixtureInfo.map((fixture) => {
          for (let i = 0; i < currentFixturesWithEvents.length; i++) {
            if (
              fixture.fixture.id === currentFixturesWithEvents[i].fixture.id
            ) {
              let fixtureWithEvents = fixture;
              fixtureWithEvents.events = currentFixturesWithEvents[i].events;
              return fixtureWithEvents;
            }
          }
          return fixture;
        });
        return {
          ...state,
          [action.payload.fixtureInfo[0].team.id]: {
            fixtureInfo: newFixturesArray,
            lastUpdated: action.payload.lastUpdated,
          },
        };
      }
    case "UPDATE_LIVE_TEAM_FIXTURES":
      if (action.payload.fixtureInfo.length === 0) {
        return { ...state };
      } else {
        const updatedFixturesArray = state[action.payload.team].fixtureInfo.map(
          (fixture) => {
            for (let i = 0; i < action.payload.fixtureInfo.length; i++) {
              if (
                fixture.fixture.id === action.payload.fixtureInfo[i].fixture.id
              ) {
                return action.payload.fixtureInfo[i];
              }
            }
            return fixture;
          }
        );
        return {
          ...state,
          [action.payload.team]: {
            fixtureInfo: updatedFixturesArray,
            lastUpdated: action.payload.lastUpdated,
          },
        };
      }
    case "UPDATE_LIVE_TEAM_FIXTURES_BY_ID":
      const updatedFixturesArrayById = state[
        action.payload.fixtureInfo[0].team.id
      ].fixtureInfo.map((fixture) => {
        if (fixture.fixture.id === action.payload.fixtureInfo[0].fixture.id) {
          return action.payload.fixtureInfo[0];
        }
        return fixture;
      });
      return {
        ...state,
        [action.payload.fixtureInfo[0].team.id]: {
          fixtureInfo: updatedFixturesArrayById,
          lastUpdated: action.payload.lastUpdated,
        },
      };
    default:
      return state;
  }
};
