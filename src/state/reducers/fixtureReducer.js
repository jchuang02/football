/* eslint-disable import/no-anonymous-default-export */
export default (state = [], action) => {
    switch (action.type) {
      case "FETCH_FIXTURE":
        return action.payload;
      default:
        return state;
    }
  };
  
  
  