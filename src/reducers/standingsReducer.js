/* eslint-disable import/no-anonymous-default-export */
export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_STANDINGS":
      return {
        ...state,
        [action.payload.standingInfo.league.id]: action.payload,
      };
    case "UPDATE_STANDINGS":
      return {
        ...state,
        [action.payload.standingInfo.league.id]: action.payload,
      }
    default:
      return state;
  }
};
