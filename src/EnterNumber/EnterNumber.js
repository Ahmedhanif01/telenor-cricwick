import React from "react";
import Button from "../button/Button";
import {
  saveUTMParams,
  getUTMMediun,
  saveChargedEvent,
  reportGtagConversion,
  facebookPixelEvents,
  TikTokPixelEvent,
} from "../helper/index";
import language from "../translations";
import { LandingPageService } from "../Service/LandingPageService";
function EnterNumber({ state, dispatch }) {
  const {
    lang,
    isHE,
    msisdn,
    number,
    telco,
    error,
    loading,
    configuration,
    services,
    flow,
  } = state;
  const userAgent = navigator.userAgent;

  const sendPin = async (telco, number) => {
    dispatch({ type: "loading", payload: true });
    dispatch({ type: "error", payload: "" });
    const subSrc = getUTMMediun(); //getParametrByName("utm_medium");
    isHE
      ? window.gtag("event", "he_first_button_pressed")
      : window.gtag("event", "send_pin_pressed");
    isHE
      ? facebookPixelEvents("he_first_button_pressed")
      : facebookPixelEvents("send_pin_pressed");
    if (isHE) {
      try {
        let url;
        if (state.flow === "SINGLE_CLICK") {
          url = telco.header.singleClick.getUrl({
            ...state,
            subSrc,
            userAgent,
            number,
          });
        } else {
          url = telco.header.clicks[0].getUrl({
            ...state,
            subSrc,
            userAgent,
            number,
          });
        }
        let resp = await fetch(url);
        resp = await resp.json();
        if (resp.status === 1) {
          if (state.flow === "SINGLE_CLICK") {
            window.gtag(
              "event",
              "he_first_button_single_click_pressed_success",
              { ...resp }
            );
            facebookPixelEvents(
              "he_first_button_single_click_pressed_success",
              { ...resp }
            );
            facebookPixelEvents("he_user_single_click_success", { ...resp });
            window.gtag("event", "he_user_single_click_success", { ...resp });
            reportGtagConversion(resp);
            await saveUTMParams(window.utm, "subscribe", number);
            await saveChargedEvent(resp, number);
            telco.startRedirection(number, "sblp");
            // window.location.href = `https://gago.games/?subscriptionNo=${number}&utm_campaign=internal&utm_medium=sublp`
            return;
          }
          dispatch({ type: "pinSent", payload: true });
          dispatch({ type: "token", payload: resp.data.token });

          window.gtag("event", "he_first_button_pressed_success", { ...resp });
          facebookPixelEvents("he_first_button_pressed_success", { ...resp });
        } else {
          if (resp.responseCode === 102) {
            window.gtag("event", "he_user_asub_redirected", { ...resp });
            facebookPixelEvents("he_user_asub_redirected", { ...resp });
            TikTokPixelEvent();
            await saveChargedEvent(resp, number);
            telco.startRedirection(number, "asblp");
            // window.location.href = `https://gago.games/?subscriptionNo=${number}&utm_campaign=internal&utm_medium=asublp`
            return;
          }
          dispatch({ type: "error", payload: resp.message });
          window.gtag("event", "he_first_button_pressed_fail", { ...resp });
          facebookPixelEvents("he_first_button_pressed_fail", { ...resp });
          if (state.flow === "SINGLE_CLICK")
            window.gtag("event", "he_first_button_single_click_pressed_fail", {
              ...resp,
            });
          facebookPixelEvents("he_first_button_single_click_pressed_fail", {
            ...resp,
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      try {
        let resp = await fetch(
          telco.pinFlow.getSendPinUrl({ ...state, subSrc, userAgent, number })
        );
        resp = await resp.json();

        if (resp.status === 1) {
          dispatch({ type: "pinSent", payload: true });
          window.gtag("event", "send_pin_pressed_success", { ...resp });
          facebookPixelEvents("send_pin_pressed_success", { ...resp });
          saveUTMParams(window.utm, "send_pin", msisdn ? msisdn : number);
        } else {
          console.log("error: ", resp);
          if (
            resp.message.toLowerCase() === "already sub" ||
            resp.message.toLowerCase() ===
              "user already subscribed on the requested service"
          ) {
            window.gtag("event", "user_asub_redirected", { ...resp });
            facebookPixelEvents("user_asub_redirected", { ...resp });
            TikTokPixelEvent();
            await saveChargedEvent(resp, number);
            telco.startRedirection(number, "sblp");
            // window.location.href = `https://gago.games/?subscriptionNo=${number}&utm_campaign=internal&utm_medium=asublp`
            return;
          }
          dispatch({ type: "error", payload: resp.message });
          window.gtag("event", "send_pin_pressed_fail", { ...resp });
          facebookPixelEvents("send_pin_pressed_fail", { ...resp });
          console.log("Send pin message", resp.message);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    dispatch({ type: "loading", payload: false });
  };
  const validation = () => {
    dispatch({ type: "loading", payload: true });

    if (isHE) {
      sendPin(telco, number);
      return;
    }
    let response = configuration.validateNum(number);
    if (response.status === true) {
      LandingPageService.getValidNumber(number).then((resp) => {
        if (!resp.data.status) {
          dispatch({ type: "error", payload: language[lang].enterValidNumber });
        } else {
          let telco = configuration.services
            .filter((service) => services.includes(service.SERVICE_ID))
            .find((telco) =>
              telco.OPERATOR_NAME.includes(resp.data.telco.name)
            );
          if (telco) {
            dispatch({ type: "telco", payload: telco });
            dispatch({ type: "number", payload: number });
            sendPin(telco, number);
          } else {
            // alert("An Error Occured");
            dispatch({
              type: "error",
              payload: language[lang].enter_ufone_telenor_num,
            });
            dispatch({ type: "loading", payload: false });
          }
        }
      });
    } else {
      dispatch({
        type: "error",
        payload: language[lang].please_enter_your_number,
      });
      dispatch({ type: "loading", payload: false });
    }
    //
    // if (!response.status) {
    //   dispatch({ type: "error", payload: language[lang].enterValidNumber });
    // } else {
    //   let telco = configuration.services
    //     .filter((service) => services.includes(service.SERVICE_ID))
    //     .find((telco) => telco.PREFIX.includes(response.prefix));
    //   if (telco) {
    //     dispatch({ type: "telco", payload: telco });
    //     dispatch({ type: "number", payload: response.number });
    //     sendPin(telco, response.number);
    //   } else {
    //     // alert("An Error Occured");
    //     dispatch({ type: "error", payload: language[lang].enterValidNumber });
    //   }
    // }
  };
  return (
    <div className="input-form">
      <>
        <div className="label-text">{language[lang].enter_number}</div>
        <div className="input">
          <input
            id="number"
            type="number"
            value={number}
            disabled={isHE}
            onChange={(e) =>
              dispatch({ type: "number", payload: e.target.value })
            }
            placeholder={configuration ? configuration.placeHolder : ""}
          ></input>
        </div>
      </>
      <div className={lang === "en" ? "error en" : "error ur"}> {error}</div>
      <div className={lang === "en" ? "sub-btn en" : "sub-btn ur"}>
        <Button
          lang={lang}
          loading={loading}
          validation={validation}
          flow={flow}
          title={
            flow === "SINGLE_CLICK"
              ? language[lang].subscribe
              : language[lang].subscribe
          }
        />
      </div>
    </div>
  );
}

export default EnterNumber;
