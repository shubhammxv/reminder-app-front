import { ENV } from '../../env.js';

export const FETCH_TRAVEL_TIME = "FETCH_TRAVEL_TIME";
export const POST_EMAIL_TIME = "POST_EMAIL_TIME";
export const PUT_API_CALL = "PUT_API_CALL";
export const SET_EMAIL_DATA = "SET_EMAIL_DATA";

export const fetchTravelTime = (origin, dest) => {
  return async dispatch => {
    const url =
      `${ENV.MATRIX_API}&origins=${origin}&destinations=${dest}&key=${ENV.APIKEY}`;

    try {
      const response  = await fetch(url);
      dispatch(putApiCall(url, new Date(), 'GET'));
      console.log("Status", response.status);
      if (!response.status === 200) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      console.log(" JSON", resData);
      dispatch({
        type: FETCH_TRAVEL_TIME,
        data: resData
      })
    } catch (err) {
      console.log("Error in Fetch", err);
      throw err;
    }
  }
}

export const postEmailTime = (time, email, data) => {
  return async dispatch => {
    const url = `${ENV.SERVER_HOST}remind/setReminder`;
    try {
      const { destination_addresses, origin_addresses } = data;
      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            remindAt: time + 330 * 60 * 1000,
            email: email,
            origin: origin_addresses,
            destination: destination_addresses,
          })
        }
      )
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const resData = await response.json();
      dispatch({
        type: POST_EMAIL_TIME,
        data: resData
      })
    } catch (err) {
      throw err;
    }
  }
}

export const putApiCall = (api, time, method) => {
  return dispatch => {
    dispatch({
      type: PUT_API_CALL,
      data: {
        method: method,
        api: api,
        callTime: time
      }
    })
  }
}

export const setEmailData = (time, data) => {
  console.log("Setting Email Data", time, data);
  return dispatch => {
    dispatch({
      type: SET_EMAIL_DATA,
      data: {
        time: time,
        origin: data.origin_addresses,
        destination: data.destination_addresses,
      }
    })
  }
}
