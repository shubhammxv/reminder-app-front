import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
        <BrowserRouter>
          <Switch>
            <Route path="/" component={ReminderApp} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
