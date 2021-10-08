/* eslint-disable import/no-anonymous-default-export */
export default (state = null, action) => {
    switch (action.type) {
        case "SET_SELECTED":
            return action.payload;
        default:
            return state;
    }
}