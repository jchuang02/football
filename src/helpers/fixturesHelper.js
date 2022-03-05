import { fixtureInProgress, fixtureFinished } from "./fixtureStatusHelper";

export const separateFixtures = (fixtures, separatedBy = 2) => {
  let separatedFixtures = [];

  for (let i = 0; i < fixtures.length; i += separatedBy) {
    const temp = fixtures.slice(i, i + separatedBy);
    if (temp.length) {
      separatedFixtures.push(temp);
    }
  }

  return separatedFixtures;
};

export const fixturesToday = (fixtures) => {
  if (fixtures.length) {
    return fixtures
      .filter((match) => {
        if (match.fixture) {
          return match.fixture.timestamp * 1000 - Date.now() <= 60000 * 60 * 24;
        } else {
          return false;
        }
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureOne.fixture.timestamp - fixtureTwo.fixture.timestamp;
      });
  }
  return "";
};

export const fixturesInProgress = (fixtures) => {
  if (fixtures.length) {
    return fixtures
      .filter((match) => {
        if (match.fixture) {
          return fixtureInProgress(match.fixture.status.short);
        } else {
          return false;
        }
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureOne.fixture.timestamp - fixtureTwo.fixture.timestamp;
      });
  }
  return "";
};

export const fixturesFinished = (fixtures) => {
  if (fixtures.length) {
    return fixtures
      .filter((match) => {
        if (match.fixture) {
          return fixtureFinished(match.fixture.status.short);
        } else {
          return false;
        }
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureTwo.fixture.timestamp - fixtureOne.fixture.timestamp;
      });
  }
  return "";
};

export const fixturesUpcoming = (fixtures) => {
  if (fixtures.length) {
    return fixtures
      .filter((match) => {
        if (match.fixture) {
          return (
            !fixtureInProgress(match.fixture.status.short) &&
            !fixtureFinished(match.fixture.status.short) &&
            match.fixture.timestamp * 1000 - Date.now() > 0
          );
        } else {
          return false;
        }
      })
      .sort((fixtureOne, fixtureTwo) => {
        return fixtureOne.fixture.timestamp - fixtureTwo.fixture.timestamp;
      });
  }
  return "";
};
