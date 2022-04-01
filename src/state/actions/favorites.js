export const addFaveTeam = (id) => {
  return { type: "ADD_TEAM", payload: id };
};

export const addFaveLeague = (id) => {
  return { type: "ADD_LEAGUE", payload: id };
};

export const deleteFaveTeam = (id) => {
  return { type: "DELETE_TEAM", payload: id };
};

export const deleteFaveLeague = (id) => {
  return { type: "DELETE_LEAGUE", payload: id };
};

export const resetFollowed = () => {
  return { type: "RESET_FOLLOWED", payload: null };
};
