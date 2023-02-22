import {
  getParametrByName,
  getAllPathsInUrl,
  getErrorObj,
  getNumbervalidObj,
  redirectOnMKTV,
} from "../helper";

const telenor_pakistan_daily = 78; // telenor service id
// const ufone_pakistan_daily = 32; // ufone service id
// const zong_pakistan_daily = 57; // zong service id
// const telenor_pakistan_free_daily = 21;

// pin length
const TELENOR_PAKISTAN_WEEKLY_PIN_LENGTH = 4;
// const ZONG_PAKISTAN_DAILY_PIN_LENGTH = 4;
// const UFONE_PAKISTAN_DAILY_PIN_LENGTH = 4;
// const TELENOR_PAKISTAN_FREE_WEEKLY_PIN_LENGTH = 4;

const validateNumberPK = (number) => {
  if (number.trim().length === 0) {
    return getErrorObj("Please enter Valid number");
  }

  let msisdn = number;
  if (msisdn.substring(0, 6) === "009203") {
    msisdn = `03${msisdn.substring(6)}`;
  } else if (msisdn.substring(0, 5) === "00923") {
    msisdn = `03${msisdn.substring(5)}`;
  } else if (msisdn.substring(0, 4) === "0923") {
    msisdn = `03${msisdn.substring(4)}`;
  } else if (msisdn.substring(0, 4) === "9203") {
    msisdn = `03${msisdn.substring(4)}`;
  } else if (msisdn.substring(0, 3) === "923") {
    msisdn = `03${msisdn.substring(3)}`;
  } else if (msisdn.substring(0, 3) === "903") {
    msisdn = `03${msisdn.substring(3)}`;
  } else if (msisdn.substring(0, 2) === "03") {
    msisdn = `03${msisdn.substring(2)}`;
  } else if (msisdn.substring(0, 1) === "3") {
    msisdn = `03${msisdn.substring(1)}`;
  } else {
    return getErrorObj("Please enter Valid number");
  }

  // let initial = msisdn.substring(0, 2);
  // let numero = msisdn.substring(2, 3);

  if (msisdn.length !== 11) {
    return getErrorObj("Please enter Valid number");
  } else {
    return getNumbervalidObj(msisdn);
  }
};

class ConfigManager {
  // singleton instance
  static instance = null;
  cricwick = "http://cricwick.net/knect/";
  pinflow = "http://44.224.168.120:8078/knectapi/";
  configuration = {
    pk: {
      services: [
        {
          PARTNER_ID: 23,
          CAMPAIGN_ID: 43,
          SERVICE_ID: telenor_pakistan_daily,
          SOURCE_ID: 23,
          PREFIX: ["4"],
          SERVICE_NAME: "tp",
          OPERATOR_NAME: "telenor",
          defaults: true,
          // header: null,
          header: {
            getNumberUrl: () => {
              let partner_id = getParametrByName("partner_id");
              return `${this.cricwick}checkhe?serviceId=${
                this.configuration.pk.services[0].SERVICE_ID
              }&partnerId=${
                partner_id
                  ? partner_id
                  : this.configuration.pk.services[0].PARTNER_ID
              }`;
            },
            singleClick: {
              getUrl: ({ token, ip, subSrc }) => {
                let partner_id = getParametrByName("partner_id");
                return `${this.cricwick}single_click?token=${token}&serviceId=${
                  this.configuration.pk.services[0].SERVICE_ID
                }&partnerId=${
                  partner_id
                    ? partner_id
                    : this.configuration.pk.services[0].PARTNER_ID
                }&userIp=${ip}&subSource=${subSrc}&campaignId=${
                  this.configuration.pk.services[0].CAMPAIGN_ID
                }`;
              },
            },
            clicks: [
              {
                getUrl: ({ token, ip, subSrc }) => {
                  let partner_id = getParametrByName("partner_id");
                  return `${
                    this.cricwick
                  }header_click1?token=${token}&serviceId=${
                    this.configuration.pk.services[0].SERVICE_ID
                  }&partnerId=${
                    partner_id
                      ? partner_id
                      : this.configuration.pk.services[0].PARTNER_ID
                  }&userIp=${ip}&sourceId=${
                    this.configuration.pk.services[0].SOURCE_ID
                  }&subSource=${subSrc}&campaignId=${
                    this.configuration.pk.services[0].CAMPAIGN_ID
                  }`;
                },
              },
              {
                getUrl: ({ token, number, userAgent }) => {
                  let partner_id = getParametrByName("partner_id");
                  return `${this.pinflow}pinless_verifytoken?service_id=${
                    this.configuration.pk.services[0].SERVICE_ID
                  }&partner_id=${
                    partner_id
                      ? partner_id
                      : this.configuration.pk.services[0].PARTNER_ID
                  }&token=${token}&msisdn=${number}&user_agent=${userAgent}`;
                },
              },
            ],
          },

          

          pinFlow: {
            getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
              let partner_id = getParametrByName("partner_id");
              return `${this.pinflow}send_pin?service_id=${
                this.configuration.pk.services[0].SERVICE_ID
              }&partner_id=${
                partner_id
                  ? partner_id
                  : this.configuration.pk.services[0].PARTNER_ID
              }&sub_source=${subSrc}&campaign_id=${
                this.configuration.pk.services[0].CAMPAIGN_ID
              }&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
            },
            getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
              let partner_id = getParametrByName("partner_id");
              return `${this.pinflow}confirm_pin?service_id=${
                this.configuration.pk.services[0].SERVICE_ID
              }&partner_id=${
                partner_id
                  ? partner_id
                  : this.configuration.pk.services[0].PARTNER_ID
              }&sub_source=${subSrc}&campaign_id=${
                this.configuration.pk.services[0].CAMPAIGN_ID
              }&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
            },
            isMcpEnabled: false,
            mcpScript: () => ``,
          },
          validatePINLength: (pin) => {
            if (pin.length === TELENOR_PAKISTAN_WEEKLY_PIN_LENGTH) {
              return true;
            }
            return false;
          },
          startRedirection: (number, medium) => {
            redirectOnMKTV(number, medium);
          },
        },
        // {
        //     PARTNER_ID: 2,
        //     CAMPAIGN_ID: 13,
        //     SERVICE_ID: telenor_pakistan_free_daily,//free trial service of tp
        //     SOURCE_ID: 2,
        //     PREFIX: ["4"],
        //     SERVICE_NAME: "tpx",
        //     defaults: false,
        //     header: {
        //         getNumberUrl: () => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.cricwick}checkhe?serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}`
        //         },
        //         singleClick:
        //         {
        //             getUrl: ({ token, ip, subSrc }) => {
        //                 let partner_id = getParametrByName("partner_id");
        //                 return `${this.cricwick}single_click?token=${token}&serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&userIp=${ip}&subSource=${subSrc}&campaignId=${this.configuration.pk.services[1].CAMPAIGN_ID}`
        //             }
        //         }
        //         ,
        //         clicks: [
        //             {
        //                 getUrl: ({ token, ip, subSrc }) => {
        //                     let partner_id = getParametrByName("partner_id");
        //                     return `${this.cricwick}header_click1?token=${token}&serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&userIp=${ip}&sourceId=${this.configuration.pk.services[1].SOURCE_ID}&subSource=${subSrc}&campaignId=${this.configuration.pk.services[1].CAMPAIGN_ID}`
        //                 }
        //             },
        //             {
        //                 getUrl: ({ token, number, userAgent }) => {
        //                     let partner_id = getParametrByName("partner_id");
        //                     return `${this.pinflow}pinless_verifytoken?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&token=${token}&msisdn=${number}&user_agent=${userAgent}`;
        //                 }
        //             }
        //         ]
        //     },
        //     pinFlow: {
        //         getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.pinflow}send_pin?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.pk.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
        //         },
        //         getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.pinflow}confirm_pin?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.pk.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
        //         },
        //         isMcpEnabled: false,
        //         mcpScript: () => ``
        //     },
        //     validatePINLength: (pin) => {
        //         if (pin.length === TELENOR_PAKISTAN_FREE_WEEKLY_PIN_LENGTH) {
        //             return true
        //         }
        //         return false;
        //     },
        //     startRedirection: (number, medium) => {
        //         redirectOnMKTV(number, medium);
        //     }
        // },
        ////////////////
        // {
        //     PARTNER_ID: 2,
        //     CAMPAIGN_ID: 27,
        //     SERVICE_ID: ufone_pakistan_daily,
        //     SOURCE_ID: 2,
        //     PREFIX: ["3"],
        //     SERVICE_NAME: "ufone",
        //     OPERATOR_NAME: "ufone",
        //     defaults: true,
        //     header: null,
        //     // header: {
        //     //     getNumberUrl: () => {
        //     //         let partner_id = getParametrByName("partner_id");
        //     //         return `${this.cricwick}checkhe?serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}`
        //     //     },
        //     //     singleClick:
        //     //     {
        //     //         getUrl: ({ token, ip, subSrc }) => {
        //     //             let partner_id = getParametrByName("partner_id");
        //     //             return `${this.cricwick}single_click?token=${token}&serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&userIp=${ip}&subSource=${subSrc}&campaignId=${this.configuration.pk.services[1].CAMPAIGN_ID}`
        //     //         }
        //     //     }
        //     //     ,
        //     //     clicks: [
        //     //         {
        //     //             getUrl: ({ token, ip, subSrc }) => {
        //     //                 let partner_id = getParametrByName("partner_id");
        //     //                 return `${this.cricwick}header_click1?token=${token}&serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&userIp=${ip}&sourceId=${this.configuration.pk.services[1].SOURCE_ID}&subSource=${subSrc}&campaignId=${this.configuration.pk.services[1].CAMPAIGN_ID}`
        //     //             }
        //     //         },
        //     //         {
        //     //             getUrl: ({ token, number, userAgent }) => {
        //     //                 let partner_id = getParametrByName("partner_id");
        //     //                 return `${this.pinflow}pinless_verifytoken?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&token=${token}&msisdn=${number}&user_agent=${userAgent}`;
        //     //               }
        //     //             }
        //     //         ]
        //     //     },
        //     pinFlow: {
        //         getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.pinflow}send_pin?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.pk.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
        //         },
        //         getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.pinflow}confirm_pin?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.pk.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
        //         },
        //         isMcpEnabled: false,
        //         mcpScript: () => ``
        //     },
        //     validatePINLength: (pin) => {
        //         if (pin.length === UFONE_PAKISTAN_DAILY_PIN_LENGTH) {
        //             return true
        //         }
        //         return false;
        //     },
        //     startRedirection: (number, medium) => {
        //         redirectOnMKTV(number, medium);
        //     }
        // },
        // {
        //     PARTNER_ID: 2,
        //     CAMPAIGN_ID: 27,
        //     SERVICE_ID: zong_pakistan_daily,
        //     SOURCE_ID: 2,
        //     PREFIX: ["1"],
        //     SERVICE_NAME: "zong",
        //     OPERATOR_NAME: "zong",
        //     defaults: true,
        //     header: null,
        //     // header: {
        //     //     getNumberUrl: () => {
        //     //         let partner_id = getParametrByName("partner_id");
        //     //         return `${this.cricwick}checkhe?serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}`
        //     //     },
        //     //     singleClick:
        //     //     {
        //     //         getUrl: ({ token, ip, subSrc }) => {
        //     //             let partner_id = getParametrByName("partner_id");
        //     //             return `${this.cricwick}single_click?token=${token}&serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&userIp=${ip}&subSource=${subSrc}&campaignId=${this.configuration.pk.services[1].CAMPAIGN_ID}`
        //     //         }
        //     //     }
        //     //     ,
        //     //     clicks: [
        //     //         {
        //     //             getUrl: ({ token, ip, subSrc }) => {
        //     //                 let partner_id = getParametrByName("partner_id");
        //     //                 return `${this.cricwick}header_click1?token=${token}&serviceId=${this.configuration.pk.services[1].SERVICE_ID}&partnerId=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&userIp=${ip}&sourceId=${this.configuration.pk.services[1].SOURCE_ID}&subSource=${subSrc}&campaignId=${this.configuration.pk.services[1].CAMPAIGN_ID}`
        //     //             }
        //     //         },
        //     //         {
        //     //             getUrl: ({ token, number, userAgent }) => {
        //     //                 let partner_id = getParametrByName("partner_id");
        //     //                 return `${this.pinflow}pinless_verifytoken?service_id=${this.configuration.pk.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[1].PARTNER_ID}&token=${token}&msisdn=${number}&user_agent=${userAgent}`;
        //     //               }
        //     //             }
        //     //         ]
        //     //     },
        //     pinFlow: {
        //         getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.pinflow}send_pin?service_id=${this.configuration.pk.services[2].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[2].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.pk.services[2].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
        //         },
        //         getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
        //             let partner_id = getParametrByName("partner_id");
        //             return `${this.pinflow}confirm_pin?service_id=${this.configuration.pk.services[2].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.pk.services[2].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.pk.services[2].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
        //         },
        //         isMcpEnabled: false,
        //         mcpScript: () => ``
        //     },
        //     validatePINLength: (pin) => {
        //         if (pin.length === ZONG_PAKISTAN_DAILY_PIN_LENGTH) {
        //             return true
        //         }
        //         return false;
        //     },
        //     startRedirection: (number, medium) => {
        //         redirectOnMKTV(number, medium);
        //     }
        // },
      ],
      languages: ["en", "ur"],
      price_points: {
        en: () => {
          let allPaths = getAllPathsInUrl(window.location.pathname);
          if (allPaths.includes("telenor")) {
            return "Service charges PKR 4.78 (tax inclusive) per day to be deducted from mobile balance.";
          } else
            return `Telenor: Service charges PKR 4.78 (tax inclusive) per day to be deducted from mobile balance.
                        \nBy subscribing the service you agree to daily recurring charges deduction from your mobile balance until unsubscribed.
                        `;
        },
        ur: () => {
          let allPaths = getAllPathsInUrl(window.location.pathname);
          if (allPaths.includes("telenor")) {
            return "سروس چارجز PKR 4.18 (ٹیکس سمیت) یومیہ موبائل بیلنس سے کاٹے جائیں گے۔";
          } else
            return `
             Telenor: سروس چارجز PKR 4.18 (ٹیکس سمیت) یومیہ موبائل بیلنس سے کاٹے جائیں گے۔
            \nسروس کو سبسکرائب کر کے آپ ان سبسکرائب ہونے تک اپنے موبائل بیلنس سے روزانہ اعادی چارجز کی کٹوتی سے اتفاق کرتے ہیں۔
                        `;
        },
      },
      placeHolder: "E.g: 03XXXXXXXXX",
      validateNum: (number) => {
        return validateNumberPK(number);
      },
      getValidServices: () => {
        // let allPaths = getAllPathsInUrl(window.location.pathname);
        // if (allPaths.includes('telenor')) {
        //     return [telenor_pakistan_free_weekly];

        // }
        // if (allPaths) {
        //     let services = this.configuration.pk.services.filter(services => services.SERVICE_NAME === getServiceNameFromURL);
        //     if (services.length)
        //         return services
        //     else
        //         return this.configuration.pk.services.filter(services => services.defaults === true);
        // }
        // return this.configuration.pk.services.filter(services => services.defaults === true);
        return [telenor_pakistan_daily];
      },
    },
  };

  static createInstance() {
    var object = new ConfigManager();
    return object;
  }

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = ConfigManager.createInstance();
    }
    return ConfigManager.instance;
  }
}

const configManager = ConfigManager.getInstance();
export default configManager.configuration;
