import React, { useEffect } from "react";
import Button from "../button/Button";
import {
  // getCDNUrl,
  saveUTMParams,
  getUTMMediun,
  saveChargedEvent,
  reportGtagConversion,
  facebookPixelEvents,
  TikTokPixelEvent,
} from "../helper/index";
import language from "../translations";
import { LandingPageService } from "../Service/LandingPageService";

export default function EnterPin({ state, dispatch }) {
  const {
    lang,
    isHE,
    number,
    loading,
    pin,
    error,
    telco,
    isNumberPopulatedWithHE,
  } = state;
  const userAgent = navigator.userAgent;
  const confirmPin = async () => {
    dispatch({ type: "error", payload: "" });
    dispatch({ type: "loading", payload: true });

    const subSrc = getUTMMediun();
    isHE
      ? window.gtag("event", "he_second_button_pressed")
      : window.gtag("event", "confirm_pin_pressed");
    isHE
      ? facebookPixelEvents("he_second_button_pressed")
      : facebookPixelEvents("confirm_pin_pressed");
    if (isHE) {
      try {
        let resp = await fetch(
          telco.header.clicks[1].getUrl({ ...state, subSrc, userAgent })
        );
        resp = await resp.json();
        if (resp.status === 1) {
          window.gtag("event", "he_second_button_pressed_success", { ...resp });
          facebookPixelEvents("he_second_button_pressed_success", { ...resp });
          facebookPixelEvents("header_subscription_successfull", { ...resp });
          window.gtag("event", "header_subscription_successfull", { ...resp });
          reportGtagConversion(resp);
          await saveUTMParams(window.utm, "subscribe", number);
          window.gtag("event", "user_redirected", { ...resp });
          facebookPixelEvents("user_redirected", { ...resp });
          TikTokPixelEvent();
          await saveChargedEvent(resp, number);
          telco.startRedirection(number, "lp");
          // window.location.href = `https://gago.games/?subscriptionNo=${number}&utm_campaign=internal&utm_medium=lp`
          return;
        } else {
          if (resp.responseCode === 102) {
            await saveChargedEvent(resp, number);
            telco.startRedirection(number, "lp");
            // window.location.href = `https://gago.games/?subscriptionNo=${number}&utm_campaign=internal&utm_medium=lp`
            return;
          }
          window.gtag("event", "he_second_button_pressed_fail", { ...resp });
          facebookPixelEvents("he_second_button_pressed_fail", { ...resp });
          dispatch({ type: "error", payload: resp.message });
          console.log("Confirm pin message", resp.message);
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      try {
        let resp = await fetch(
          telco.pinFlow.getConfirmPinUrl({ ...state, subSrc, userAgent })
        );
        resp = await resp.json();
        saveUTMParams(window.utm, "confirm_pin", number);
        if (resp.status === 1) {
          window.gtag("event", "confirm_pin_pressed_success", { ...resp });
          facebookPixelEvents("confirm_pin_pressed_success", { ...resp });
          facebookPixelEvents("pinflow_subscription_successfull", { ...resp });
          window.gtag("event", "pinflow_subscription_successfull", { ...resp });
          reportGtagConversion(resp);
          await saveUTMParams(window.utm, "subscribe", number);
          // alert('You have successfully subscribed to our service, you will redirect to our portal.')
          window.gtag("event", "user_redirected");
          facebookPixelEvents("user_redirected");
          TikTokPixelEvent();
          await saveChargedEvent(resp, number);
          telco.startRedirection(number, "lp");
          // window.location.href = `https://gago.games/?subscriptionNo=${number}&utm_campaign=internal&utm_medium=lp`
        } else {
          window.gtag("event", "confirm_pin_pressed_fail", { ...resp });
          facebookPixelEvents("confirm_pin_pressed_fail", { ...resp });
          dispatch({ type: "error", payload: resp.message });
          console.log("Confirm pin message", resp.message);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    dispatch({ type: "loading", payload: false });
  };
  const validatePinLength = () => {
    dispatch({ type: "error", payload: "" });
    if (isHE) {
      confirmPin();
      return;
    }
    if (!isHE && isNumberPopulatedWithHE) {
      confirmPin();
      return;
    }
    if (!isNumberPopulatedWithHE && telco.validatePINLength(pin.trim())) {
      confirmPin();
      return;
    } else {
      dispatch({ type: "error", payload: language[lang].enterValidPin });
      return false;
    }
  };
  useEffect(() => {
    if (!isHE && isNumberPopulatedWithHE) {
      LandingPageService.getHEPin(telco.PARTNER_ID, telco.SERVICE_ID)
        .then((resp) => {
          if (resp.data.status === 1) {
            document
              .getElementById("input-pin")
              .setAttribute("value", resp.data.data.otp);
            dispatch({ type: "pin", payload: String(resp.data.data.otp) });
          }
        })
        .catch(console.log);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="input-form">
      {!isHE && (
        <>
          <div className="label-text">{language[lang].enter_pin}</div>
          <div className="input">
            <input
              type="tel"
              id="input-pin"
              onChange={(e) =>
                dispatch({ type: "pin", payload: e.target.value })
              }
              // eslint-disable-next-line
              placeholder={"E.g: " + "XXXX"}
              max={5}
              min={5}
            />
          </div>
        </>
      )}
      <div className="error"> {error}</div>
      <div className={lang === "en" ? "sub-btn en" : "sub-btn ur"}>
        <div className="back-button">
          <Button
            lang={lang}
            loading={loading}
            validation={validatePinLength}
            title={language[lang].subscribe}
          />
        </div>
      </div>
    </div>
  );
}
