import { fixtureInProgress, fixtureFinished } from "./fixtureStatusHelper";

export const separateFixtures = (fixtures) => {
  let separatedFixtures = [];

  for (let i = 0; i < fixtures.length; i += 2) {
    if (fixtures[i] && fixtures[i + 1]) {
      const first = fixtures[i];
      const second = fixtures[i + 1];
      separatedFixtures.push([first, second]);
    } else if (i > 0) {
      separatedFixtures.push([fixtures[i - 1]]);
    } else {
      separatedFixtures.push([fixtures[i]]);
    }
  }

  return separatedFixtures;
};

export const fixturesInProgress = (fixtures) => {
  if (fixtures) {
    return fixtures
      .filter(({ fixture }) => {
        return fixtureInProgress(fixture.status.short);
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureOne.fixture.timestamp - fixtureTwo.fixture.timestamp;
      });
  }
  return "";
};

export const fixturesFinished = (fixtures) => {
  if (fixtures) {
    return fixtures
      .filter(({ fixture }) => {
        return fixtureFinished(fixture.status.short);
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureTwo.fixture.timestamp - fixtureOne.fixture.timestamp;
      });
  }
  return "";
};

export const fixturesUpcoming = (fixtures) => {
  if (fixtures) {
    return fixtures
      .filter((fixture) => {
        return (
          !fixtureInProgress(fixture.fixture.status.short) &&
          !fixtureFinished(fixture.fixture.status.short) &&
          fixture.fixture.timestamp * 1000 - Date.now() > 0
        );
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureOne.fixture.timestamp - fixtureTwo.fixture.timestamp;
      });
  }
  return "";
};
