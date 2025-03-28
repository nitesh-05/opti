import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { dashboardReducer } from "./dashboardReducer";


const reducers = combineReducers({

	userProfile: authReducer,
	dashboard: dashboardReducer,

});

const rootReducer = (state, action) => {
	if (action.type === "REMOVE_USER_AUTH") {
		return reducers(undefined, action);
	}
	return reducers(state, action);
};
export default rootReducer;
