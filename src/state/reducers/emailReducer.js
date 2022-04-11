/* eslint-disable import/no-anonymous-default-export */
export default (state = "", action) => {
  switch (action.type) {
    case "SET_EMAIL":
      return action.payload;
    case "DELETE_EMAIL":
      return action.payload;
    default:
      return state;
  }
};
