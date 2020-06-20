import {
  FETCH_TRAVEL_TIME,
  POST_EMAIL_TIME,
  PUT_API_CALL,
  SET_EMAIL_DATA,
} from '../actions/reminder';

const initialState = {
  travelData: {
    destination_addresses: 'Kormangala',
    origin_addresses: 'Hebbal',
    rows: [],
  },
  emailData: {
    time: '',
    origin: '',
    destination: ''
  },
  apiCalls: [],
}

export default (state=initialState, action) => {
  switch(action.type) {
    case FETCH_TRAVEL_TIME:
      return { ...state, travelData: action.data };

    case SET_EMAIL_DATA:
      return { ...state, emailData: action.data };

    case PUT_API_CALL:
      console.log("Reducer", action)
      return { ...state, apiCalls: [ ...state.apiCalls, action.data ]};

    default:
      return state;
  }
}
