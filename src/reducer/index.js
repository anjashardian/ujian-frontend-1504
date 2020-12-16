import { useHistory } from 'react-router-dom'
import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import {historyReducer} from './historyReducer'

const allReducer = combineReducers({
    user: userReducer,
    history: historyReducer,

})

export default allReducer