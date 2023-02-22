// import { saveUTMParams } from "../helper";
import axios from "axios";
export const LandingPageService = {
  getIP: async () => {
    try {
      const URL = `http://www.geoplugin.net/json.gp`;
      let resp = await fetch(URL);
      resp = await resp.json();
      return resp;
    } catch (error) {
      console.error(error.message);
    }
  },
  getNumberFromHeader: async (url) => {
    try {
      let resp = await fetch(url);
      resp = await resp.json();
      return resp;
    } catch (error) {
      console.error("Error in get number from header", error.message);
    }
  },
  getValidNumber: (operator) => {
    const url = `http://knect.khaleef.com:9001/api/subscriptions/checkPkOperator`;
    return axios.get(url, {
      params: {
        msisdn: `${operator}`,
      },
    });
  },
  getHEPin: (partnerId, serviceId) => {
    const url = `http://cricwick.net/knect/get_sub_details`;
    return axios.get(url, {
      params: {
        partnerId: `${partnerId}`,
        serviceId: `${serviceId}`,
      },
    });
  },
};
