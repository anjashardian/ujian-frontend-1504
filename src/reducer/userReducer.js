const INITIAL_STATE = {
    users: [],
    cart: []
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                users: action.payload.users,
                cart: action.payload.cart
            }
        case 'LOG_OUT':
            return INITIAL_STATE
        default:
            return state
    }
}