import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import ReminderApp from './container/ReminderApp';

import reminderReducer from './store/reducers/reminder';

import './styles.css';

const rootReducer = combineReducers({
  remind: reminderReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ReminderApp />
      </Provider>
    </div>
  );
}

export default App;
