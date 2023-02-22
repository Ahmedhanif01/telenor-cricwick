import React, { useReducer, useEffect, Fragment, Suspense, lazy } from "react";
// import ReactPixel from 'react-facebook-pixel';
import "./App.css";
// import Loader from "./loader/Loader";
import { LandingPageService } from "./Service/LandingPageService";
import {
  getUserLanguage,
  getUserCountry,
  getMatchedItemFromResponse,
  ValidateUTMSource,
  saveUTMParams,
  facebookPixelEvents,
} from "./helper";

// const HeaderBarComponent = lazy(() => import("./header/HeaderBar" /* b */));
const HeaderLogoComponent = lazy(() => import("./header/HeaderLogo" /* l */));
const FooterBanner = lazy(() => import("./footer/Footer" /* l */));
const EnterNumberComponent = lazy(() =>
  import("./EnterNumber/EnterNumber" /* n */)
);
const EnterPinComponent = lazy(() => import("./EnterPin/EnterPin" /* pn */));
// const PriceTextComponent = lazy(() =>
//   import("./price-text/PriceText" /* pr */)
// );
const initialState = {
  lang: "en",
  error: "",
  loading: false,
  number: "",
  pin: "",
  isHE: false,
  isNumberPopulatedWithHE: false,
  loadingHE: false,
  ip: "",
  pinSent: false,
  isHttps: false,
  country: undefined,
  telco: undefined,
  headerClickCount: 0,
  flow: "",
  utmValidationStatus: false,
  configuration: undefined,
  services: [],
  freeGames: false,
  isHEpartnerId: "",
  isHEserviceId: "",
};
function reducer(state, action) {
  return { ...state, [action.type]: action.payload };
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // ReactPixel.init(389119693067077, options);
  useEffect(() => {
    if (window.location.protocol === "https" && !state.isHttps) {
      dispatch({ type: "isHttps", payload: true });
    }
    if (!ValidateUTMSource()) {
      dispatch({ type: "utmValidationStatus", payload: false });
      console.error("Error UTM VALIDATION FAILS");
      return;
    }
    dispatch({ type: "utmValidationStatus", payload: true });
    dispatch({ type: "country", payload: getUserCountry() });
    dispatch({ type: "lang", payload: getUserLanguage() });
  }, [state.isHttps]);

  useEffect(() => {
    if (state.country)
      (async function () {
        let config = await import("./Configuration/" + state.country);
        if (config) {
          config = config.default[state.country];
          let validServices = config.getValidServices();
          // console.log(validServices);
          dispatch({ type: "configuration", payload: config });
          dispatch({ type: "services", payload: validServices });
          dispatch({ type: "loadingHE", payload: true });
          saveUTMParams(window.utm, "install", "");
          config.services
            .filter((service) => validServices.includes(service.SERVICE_ID))
            .forEach((telco, i) => {
              if (telco.header) {
                LandingPageService.getNumberFromHeader(
                  telco.header.getNumberUrl(),
                  i
                ).then(
                  (NFHResponse) => {
                    if (NFHResponse.status === 1) {
                      dispatch({
                        type: "isHE",
                        payload: NFHResponse.data.flow === "OTP" ? false : true,
                      });
                      if (NFHResponse.data.flow === "OTP") {
                        dispatch({
                          type: "isNumberPopulatedWithHE",
                          payload: true,
                        });
                      }
                      let number = getMatchedItemFromResponse(
                        NFHResponse.data,
                        ["number", "msisdn"]
                      );
                      dispatch({ type: "number", payload: number });
                      dispatch({
                        type: "token",
                        payload: NFHResponse.data.token,
                      });
                      dispatch({
                        type: "flow",
                        payload: NFHResponse.data.flow,
                      });
                      window.gtag("event", "header_found", { ...NFHResponse });
                      facebookPixelEvents("header_found", { ...NFHResponse });
                      dispatch({ type: "telco", payload: telco });
                      saveUTMParams(
                        window.utm,
                        "install",
                        number ? number : ""
                      );
                    }
                    dispatch({ type: "loadingHE", payload: false });
                  },
                  () => {
                    dispatch({ type: "loadingHE", payload: false });
                  }
                );
              }
            });
          LandingPageService.getIP().then((getIp) => {
            dispatch({ type: "ip", payload: getIp.geoplugin_request });
          });
        }
      })();
  }, [state.country]);

  useEffect(() => {
    if (state.pinSent && state.telco && state.telco.pinFlow.isMcpEnabled) {
      //load MCP script here
      let script = state.telco.pinFlow.mcpScript();
      // eslint-disable-next-line
      eval(script);
    }
    // else
    //   console.log("else load MCP SCRIPT");
  }, [state.telco, state.pinSent]);
  const emptyView = () => {
    return <div></div>;
  };
  const mainView = () => {
    return (
      <div className="container">
        <div className={state.lang === "en" ? "en" : "ur"}>
          <Fragment>
            {/* <div>
              <Suspense fallback={<></>}>
                <HeaderBarComponent
                  dispatch={dispatch}
                  lang={state.lang}
                  languages={
                    state.configuration ? state.configuration.languages : []
                  }
                />
              </Suspense>
            </div> */}
            <div style={{ minHeight: "22%" }}>
              <Suspense fallback={<></>}>
                <HeaderLogoComponent lang={state.lang} />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<></>}>
                <section>
                  {!state.pinSent && (
                    <EnterNumberComponent state={state} dispatch={dispatch} />
                  )}
                  {state.pinSent && (
                    <EnterPinComponent state={state} dispatch={dispatch} />
                  )}
                </section>
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<></>}>
                <div className="footer-banner">
                  <FooterBanner />
                </div>
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<></>}>
                <div className="price-points-normal">
                  {state.configuration
                    ? state.configuration.price_points[state.lang]
                      ? state.configuration.price_points[state.lang]()
                      : ""
                    : ""}
                </div>
              </Suspense>
            </div>
          </Fragment>
        </div>
      </div>
    );
  };

  return (
    <>
      {state.isHttps
        ? emptyView()
        : state.utmValidationStatus
        ? mainView()
        : emptyView()}
    </>
  );
}

export default App;
