export const fixtureInProgress = (fixtureStatus) => {
  return (
    fixtureStatus === "1H" ||
    fixtureStatus === "HT" ||
    fixtureStatus === "ET" ||
    fixtureStatus === "2H" ||
    fixtureStatus === "P" ||
    fixtureStatus === "BT" ||
    fixtureStatus === "LIVE"
  );
};

//Returns true if a fixture is finished.
export const fixtureFinished = (fixtureStatus) => {
  return (
    fixtureStatus === "FT" ||
    fixtureStatus === "AET" ||
    fixtureStatus === "PEN" ||
    fixtureStatus === "ABD" ||
    fixtureStatus === "PST" ||
    fixtureStatus === "INT" ||
    fixtureStatus === "SUSP" ||
    fixtureStatus === "AWD" ||
    fixtureStatus === "CANC"
  );
};

//Returns true if a fixture is ending.
export const fixtureEnding = (fixtureElapsed, fixtureStatus) => {
  return (
    (fixtureElapsed === 90 && fixtureStatus === "2H") ||
    (fixtureElapsed >= 120 && fixtureStatus === "ET") ||
    (fixtureElapsed === null && fixtureStatus === "P")
  );
};

export const fixtureOnBreak = (fixtureElapsed, fixtureStatus) => {
  return fixtureStatus === "HT" || fixtureStatus === "BT";
};
