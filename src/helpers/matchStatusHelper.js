export const matchInProgress = (matchStatus) => {
  return (
    matchStatus === "1H" ||
    matchStatus === "HT" ||
    matchStatus === "ET" ||
    matchStatus === "2H" ||
    matchStatus === "P" ||
    matchStatus === "BT" ||
    matchStatus === "LIVE"
  );
};

//Returns true if a match is finished.
export const matchFinished = (matchStatus) => {
  return (
    matchStatus === "FT" ||
    matchStatus === "AET" ||
    matchStatus === "PEN" ||
    matchStatus === "ABD" ||
    matchStatus === "INT" ||
    matchStatus === "SUSP" ||
    matchStatus === "AWD" ||
    matchStatus === "CANC"
  );
};

//Returns true if a match is ending.
export const matchEnding = (matchElapsed, matchStatus) => {
  return (
    (matchElapsed === 90 && matchStatus === "2H") ||
    (matchElapsed >= 120 && matchStatus === "ET") ||
    (matchElapsed === null && matchStatus === "P")
  );
};

export const matchOnBreak = (matchElapsed, matchStatus) => {
  return matchStatus === "HT" || matchStatus === "BT";
};
