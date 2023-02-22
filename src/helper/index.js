import { v1 as uuidv1 } from "uuid";
// import ReactPixel from 'react-facebook-pixel';

const CDN_URL = "https://dox85mdhc5v5a.cloudfront.net/";
const CDN_URL_ASSETS = CDN_URL + "landingPageAssets/lp/";

const urlParams = new URLSearchParams(window.location.search);
// window.utm = {
const tracking_code = urlParams.get("utm_content")
  ? urlParams.get("utm_content")
  : uuidv1();
const compaign_name = urlParams.get("utm_campaign")
  ? urlParams.get("utm_campaign")
  : "";
const medium = urlParams.get("utm_medium")
  ? urlParams.get("utm_medium")
  : "Khaleef";
// subscriptionNo: urlParams.get("subscriptionNo")
// }
const countries = ["pk", "kw", "sa"];
const languages = ["en", "ur", "ar"];
const allPaths = window.location.pathname.split("/");

export const getCDNUrl = (filename) => {
  return CDN_URL_ASSETS + filename;
};
export const getTrackingCode = () => {
  return tracking_code;
};
export const getUTMMediun = () => {
  return medium;
};
export const getLastPathItem = (thePath) => {
  return thePath && thePath.substring(thePath.lastIndexOf("/") + 1);
};

export const getAllPathsInUrl = (url) => {
  return allPaths;
};

export const findCaseInsensitive = (array, value) => {
  return array.find((item) => value.toLowerCase() === item.toLowerCase());
};
export const getUserLanguage = () => {
  for (let j = 0; j < languages.length; j++) {
    const item = findCaseInsensitive(allPaths, languages[j]);
    if (item) {
      return item;
    }
  }
  return "en";
};

export const getUserCountry = () => {
  //return array.length >= 3 ? (!array[2].toLowerCase() ? "pk" : array[2].toLowerCase()) : "pk";
  for (let j = 0; j < countries.length; j++) {
    const item = findCaseInsensitive(allPaths, countries[j]);
    if (item) {
      return item;
    }
  }
  return "pk";
};

export const getMatchedValue = (array, value, defalt) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < value.length; j++) {
      if (array[i].toLowerCase() === value[j].toLowerCase())
        return value[j].toLowerCase();
    }
  }
  return defalt;
};
export const getMatchedItemFromResponse = (response, items) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i] in response) return response[items[i]];
  }
};
export const saveUTMParams = async (payload, event_name, msisdn) => {
  let url =
    "https://k8s.cricwick.net/khaleef-attribution/api/v1/attributions/mark_event?event_name=" +
    event_name +
    "&compaign_id=" +
    getCompaignId() +
    "&tracking_code=" +
    tracking_code +
    "&compaign_name=" +
    compaign_name +
    "&medium=" +
    medium +
    "&msisdn=" +
    msisdn;
  await fetch(url);
  // console.log(utmResponse);
};

export function getParametrByName(name) {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get(name);

  return c ? c : "";
}

export const getErrorObj = (message) => {
  return {
    status: false,
    message: message,
  };
};

export const getNumbervalidObj = (number) => {
  return {
    status: true,
    // initial: initial,
    // prefix: prefix,
    number: number,
  };
};

const getDefaultUTM = () => {
  return getUserCountry() === "pk" ? "200" : "200";
};
export const ValidateUTMSource = () => {
  let utms = {
    // 2: ["200"],
    23: ["200"],
    // 10: ["204"],
    // 11: ["205"],
  };
  // if (window.location.pathname.split("/").includes("telenor")){
  //    utms = {
  //     "2": ["206"],
  //     "10": ["204"],
  //     "11": ["205"],
  //   }
  // }
  let p_id = urlParams.get("partner_id") ? urlParams.get("partner_id") : "23";
  let utm_source = urlParams.get("utm_source")
    ? urlParams.get("utm_source")
    : getDefaultUTM();
  for (let i = 0; i < utms[p_id].length; i++) {
    if (utms[p_id][i] === utm_source) return true;
  }
  return false;
};
const getCompaignId = () => {
  return urlParams.get("utm_source")
    ? urlParams.get("utm_source")
    : getDefaultUTM();
};
export const saveChargedEvent = async (response, msisdn) => {
  if ("is_charged" in response && response["is_charged"] === 1) {
    await saveUTMParams({}, "charged", msisdn);
  }
};

export const reportGtagConversion = async (response) => {
  // /////////////// Gtag case for user_charged //////////////////
};

export const facebookPixelEvents = (event, payload) => {
  // if (window.location.pathname.split("/").includes("telenor")) {
  //   if (event && payload) {
  //     // ReactPixel.track(event, payload);
  //     window.fbq("track", event, payload);
  //   } else {
  //     window.fbq("track", event);
  //   }
  // }
};

export const TikTokPixelEvent = () => {
  window.gtag_report_conversion_telenor();
};

export const redirectOnMKTV = (number, medium) => {
  window.location.href = `https://cricwick.net?q=${number}`;
  return;
};

export const redirectOnZGames = (number) => {
  window.location.href = `https://cricwick.net?q=${number}`;
  return;
};
