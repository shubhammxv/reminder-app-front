const DOMAIN = 'http://localhost:8080/remind';

export const FETCH_TRAVEL_TIME = "FETCH_TRAVEL_TIME";
export const POST_EMAIL_TIME = "POST_EMAIL_TIME";
export const PUT_API_CALL = "PUT_API_CALL";
export const SET_EMAIL_DATA = "SET_EMAIL_DATA";
export const SET_INFO_MESSAGE = "SET_INFO_MESSAGE";

export const getServerStatus = () => {
  return async dispatch => {
    const url = `${DOMAIN}/status`;
    try {
      dispatch(putApiCall(
        url,
        new Date(),
        'Requested Local Server Status'
      ))
      const response = await fetch(url);
      if (!response.status === 200) {
        throw new Error('Something went wrong');
      }
      const resData = await response.json();

    } catch (err) {
      console.log("Error getting status", err);
      throw err;
    }
  }
}

export const putApiCall = (api, time, message) => {
  return dispatch => {
    dispatch({
      type: PUT_API_CALL,
      data: {
        message: message,
        api: api,
        callTime: time
      }
    })
  }
}

export const fetchTravelTime = (origin, destination) => {
  return async dispatch => {
    const url =  `${DOMAIN}/getDuration?origin=${origin}&destination=${destination}`;
    try {
      dispatch(putApiCall(
        url,
        new Date(),
        'Requested Matrix API for duration to reach destination'
      ))
      const response  = await fetch(url);

      if (!response.status === 200) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      dispatch({
        type: FETCH_TRAVEL_TIME,
        data: resData
      })
    } catch (err) {
      console.log("Error in fetching duration", err);
      throw err;
    }
  }
}

export const postEmailTime = (time, email, data) => {
  return async dispatch => {
    const url = `${DOMAIN}/setReminder`;
    try {
      dispatch(putApiCall(
        url,
        new Date(),
        'Posting data to set reminder through Email'
      ))
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
            origin: origin_addresses[0],
            destination: destination_addresses[0],
          })
        }
      )
      if (!response.status === 200) {
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

export const setEmailData = (time, data) => {
  console.log("Setting Email Data", time, data);
  return dispatch => {
    dispatch({
      type: SET_EMAIL_DATA,
      data: {
        time: time,
        origin: data.origin_addresses[0],
        destination: data.destination_addresses[0],
      }
    })
  }
}

export const setInfoMessage = (info, message, icon) => {
  return dispatch => {
    dispatch({
      type: SET_INFO_MESSAGE,
      data: {
        info: info,
        message: message,
        icon: icon
      }
    })
  }
}
