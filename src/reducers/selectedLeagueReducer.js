/* eslint-disable import/no-anonymous-default-export */
export default (state = "", action) => {
    switch (action.type) {
        case "SET_SELECTED":
            return action.payload;
        default:
            return state;
    }
}