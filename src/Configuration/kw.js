import { getParametrByName, getAllPathsInUrl, getTrackingCode, getErrorObj, getNumbervalidObj, redirectOnMKTV} from "../helper";

const STC_kuwait_DAILY = 7;
const ZAIN_kuwait_DAILY = 5;
const ZAIN_kuwait_WEEKLY = 17;
const OREDOO_kuwait_DAILY = 9;

const STC_kuwait_DAILY_PIN_LENGTH = 4;
const ZAIN_kuwait_DAILY_PIN_LENGTH = 4;
const ZAIN_kuwait_WEEKLY_PIN_LENGTH = 4;
const OREDOO_kuwait_DAILY_PIN_LENGTH = 4;

const validateNumberKW = (number) => {
    if (number.trim().length === 0) {
        return getErrorObj("Please enter Valid number");
    }

    let msisdn = number;

    if (msisdn.substring(0, 6) === "009650") {
        msisdn = `965${msisdn.substring(6)}`;
    } else if (msisdn.substring(0, 5) === "00965") {
        msisdn = `965${msisdn.substring(5)}`;
    } else if (msisdn.substring(0, 4) === "0965") {
        msisdn = `965${msisdn.substring(4)}`;
    } else if (msisdn.substring(0, 4) === "9650") {
        msisdn = `965${msisdn.substring(4)}`;
    } else if (msisdn.substring(0, 3) === "965") {
        msisdn = `965${msisdn.substring(3)}`;
    } else if (msisdn.substring(0, 1) === "0") {
        msisdn = `965${msisdn.substring(0)}`;
    } else if (msisdn.substring(0, 1) === "5") {
        msisdn = `965${msisdn.substring(0)}`;
    } else if (msisdn.substring(0, 1) === "6") {
        msisdn = `965${msisdn.substring(0)}`;
    } else if (msisdn.substring(0, 1) === "9") {
        msisdn = `965${msisdn.substring(0)}`;
    } else {
        return getErrorObj("Please enter Valid number");
    }

    let numero = msisdn.substring(3, 4);
    let initial = msisdn.substring(0, 3);

    if (msisdn.length !== 11) {
        return getErrorObj("Please enter Valid number");
    } else {
        return getNumbervalidObj(initial, numero, msisdn);
    }

}

class ConfigManager {
    // singleton instance
    static instance = null;
    cricwick = "http://cricwick.net/knect/";
    pinflow = "http://44.224.168.120:8078/gago/";
    configuration = {
        kw: {
            services: [
                {
                    PARTNER_ID: 2,
                    CAMPAIGN_ID: 14,
                    SERVICE_ID: STC_kuwait_DAILY,//STC
                    PREFIX: ["5"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.kw.services[0].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[0].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[0].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.kw.services[0].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[0].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[0].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}&UniqID=${getTrackingCode()}`;
                        },
                        isMcpEnabled: true,
                        mcpScript: () => `function addMCPScript(s, o, u, r, k) {
                          let b = s.URL;
                          let a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                           a.async = 1;
                           a.setAttribute("crossorigin", "anonymous");
                           a.src = u + 'script.js?ak=' + k + '&lpi=' + r + '&lpu=' + encodeURIComponent(b) + '&key=' + encodeURIComponent(r);
                           m.parentNode.insertBefore(a, m);
                         }
                         addMCPScript(document, "script", "http://uk.api.shield.monitoringservice.co/", "${getTrackingCode()}", "g8qZDnkBJOkA5bV4ui85")
                        `
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === STC_kuwait_DAILY_PIN_LENGTH) {
                            return true
                        }
                        return false;
                    },
                    startRedirection: (number, medium) => {
                        redirectOnMKTV(number, medium);
                    }
                },
                {
                    PARTNER_ID: 2,
                    CAMPAIGN_ID: 14,
                    SERVICE_ID: ZAIN_kuwait_DAILY,//zain
                    PREFIX: ["9"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.kw.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.kw.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}&uniqId=${getTrackingCode()}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === ZAIN_kuwait_DAILY_PIN_LENGTH) {
                            return true
                        }
                        return false;
                    },
                    startRedirection: (number, medium) => {
                        redirectOnMKTV(number, medium);
                    }
                },
                {
                    PARTNER_ID: 2,
                    CAMPAIGN_ID: 14,
                    SERVICE_ID: OREDOO_kuwait_DAILY,//oredoo
                    PREFIX: ["6"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.kw.services[2].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[2].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[2].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.kw.services[2].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[2].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[2].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}&uniqId=${getTrackingCode()}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === OREDOO_kuwait_DAILY_PIN_LENGTH) {
                            return true
                        }
                        return false;
                    },
                    startRedirection: (number, medium) => {
                        redirectOnMKTV(number, medium);
                    }
                },
                {
                    PARTNER_ID: 2,
                    CAMPAIGN_ID: 14,
                    SERVICE_ID: ZAIN_kuwait_WEEKLY,//zain
                    PREFIX: ["9"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.kw.services[3].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[3].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[3].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.kw.services[3].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.kw.services[3].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.kw.services[3].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}&uniqId=${getTrackingCode()}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === ZAIN_kuwait_WEEKLY_PIN_LENGTH) {
                            return true
                        }
                        return false;
                    },
                    startRedirection: (number, medium) => {
                        redirectOnMKTV(number, medium);
                    }
                },
            ],
            languages: ["en", "ar"],
            price_points: {
                en: () => `Zain: Users will be charged 750 Fils/weekly. To unsubscribe send E240 to 91113
                \nSTC: Users will be charged 200 Fils/daily. To unsubscribe send STOP 2 to 50235
                \nOoredoo: Users will be charged with 200 Fils/Daily. To unsubscribe send STOP 1 to 1493
                \nBy subscribing to the service you are accepting all terms and conditions of the service.`,
                ar: () => `زين: سوف يدفع المستخدمون 750 فلس / أسبوعي. لإلغاء الاشتراك أرسل E240 إلى 91113 
                \nSTC: سيتم تحصيل 200 فلس / يوميًا من المستخدمين. لإلغاء الاشتراك ، أرسل STOP 2 إلى 50235
                \nOoredoo: سيُفرض على المستخدمين 200 فلس / يوميًا. لإلغاء الاشتراك ، أرسل STOP 1 إلى 1493
                \nبالاشتراك في الخدمة ، فإنك تقبل جميع شروط وأحكام الخدمة.
                `,
            },
            placeHolder: "965 XXXXXXXXX"
            ,
            validateNum: (number) => {
                return validateNumberKW(number)
            },
            getValidServices: () => {
                // eslint-disable-next-line
                let allPaths = getAllPathsInUrl(window.location.pathname);
                // if (allPaths.includes('skd')) {
                //     return [telenor_pakistan_free_weekly];

                // }
                return [STC_kuwait_DAILY, ZAIN_kuwait_WEEKLY, OREDOO_kuwait_DAILY];
            }
        }
    }


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

