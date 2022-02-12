/* eslint-disable import/no-anonymous-default-export */
export default (state = "", action) => {
    switch (action.type) {
      case "SET_TERM":
        return action.payload;
    case "RESET_TERM":
        return action.payload;
      default:
        return state;
    }
  };
  
  
  