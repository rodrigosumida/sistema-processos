import { combineReducers } from 'redux';

import auth from './auth/reducer';
import header from './header/reducer';

export default combineReducers({
  auth,
  header
});
