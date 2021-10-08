/* eslint-disable import/no-anonymous-default-export */
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_FIXTURES":
      return {
        ...state,
        [action.payload.fixtureInfo[0].league.id]: action.payload,
      };
    case "UPDATE_FIXTURES":
      const currentFixturesWithEvents = state[
        action.payload.fixtureInfo[0].league.id
      ].fixtureInfo.filter((fixture) => {
        return fixture.events;
      });
      if (currentFixturesWithEvents.length === 0) {
        return {
          ...state,
          [action.payload.fixtureInfo[0].league.id]: action.payload,
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
          [action.payload.fixtureInfo[0].league.id]: {
            fixtureInfo: newFixturesArray,
            lastUpdated: action.payload.lastUpdated,
          },
        };
      }
    case "UPDATE_LIVE_FIXTURES":
      if (action.payload.fixtureInfo.length === 0) {
        return { ...state };
      } else {
        const updatedFixturesArray = state[
          action.payload.fixtureInfo[0].league.id
        ].fixtureInfo.map((fixture) => {
          for (let i = 0; i < action.payload.fixtureInfo.length; i++) {
            if (
              fixture.fixture.id === action.payload.fixtureInfo[i].fixture.id
            ) {
              return action.payload.fixtureInfo[i];
            }
          }
          return fixture;
        });
        return {
          ...state,
          [action.payload.fixtureInfo[0].league.id]: {
            fixtureInfo: updatedFixturesArray,
            lastUpdated: action.payload.lastUpdated,
          },
        };
      }
    case "UPDATE_LIVE_FIXTURES_BY_ID":
      const updatedFixturesArrayById = state[
        action.payload.fixtureInfo[0].league.id
      ].fixtureInfo.map((fixture) => {
        if (fixture.fixture.id === action.payload.fixtureInfo[0].fixture.id) {
          return action.payload.fixtureInfo[0];
        }
        return fixture;
      });
      return {
        ...state,
        [action.payload.fixtureInfo[0].league.id]: {
          fixtureInfo: updatedFixturesArrayById,
          lastUpdated: action.payload.lastUpdated,
        },
      };
    default:
      return state;
  }
};
