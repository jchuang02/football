// eslint-disable-next-line import/no-anonymous-default-export
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_TEAM_FIXTURES":
      return {
        ...state,
        [action.payload.team]: action.payload,
      };
    case "UPDATE_TEAM_FIXTURES":
      const currentMatchesWithEvents = state[
        action.payload.team
      ].matchInfo.filter((match) => {
        return match.events;
      });
      if (currentMatchesWithEvents.length === 0) {
        return {
          ...state,
          [action.payload.team]: action.payload,
        };
      } else {
        const newMatchesArray = action.payload.matchInfo.map((match) => {
          for (let i = 0; i < currentMatchesWithEvents.length; i++) {
            if (
              match.fixture.id === currentMatchesWithEvents[i].match.id
            ) {
              let matchWithEvents = match;
              matchWithEvents.events = currentMatchesWithEvents[i].events;
              return matchWithEvents;
            }
          }
          return match;
        });
        return {
          ...state,
          [action.payload.team]: {
            matchInfo: newMatchesArray,
            lastUpdated: action.payload.lastUpdated,
          },
        };
      }
    case "UPDATE_LIVE_TEAM_FIXTURES":
      if (action.payload.matchInfo.length === 0) {
        return { ...state };
      } else {
        const updatedMatchesArray = state[action.payload.team].matchInfo.map(
          (match) => {
            for (let i = 0; i < action.payload.matchInfo.length; i++) {
              if (
                match.fixture.id === action.payload.matchInfo[i].match.id
              ) {
                return action.payload.matchInfo[i];
              }
            }
            return match;
          }
        );
        return {
          ...state,
          [action.payload.team]: {
            matchInfo: updatedMatchesArray,
            lastUpdated: action.payload.lastUpdated,
          },
        };
      }
    case "UPDATE_LIVE_TEAM_FIXTURES_BY_ID":
      const updatedMatchesArrayById = state[
        action.payload.team
      ].matchInfo.map((match) => {
        if (match.fixture.id === action.payload.matchInfo[0].fixture.id) {
          return action.payload.matchInfo[0];
        }
        return match;
      });
      return {
        ...state,
        [action.payload.team]: {
          matchInfo: updatedMatchesArrayById,
          lastUpdated: action.payload.lastUpdated,
        },
      };
    default:
      return state;
  }
};
