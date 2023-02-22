import { getParametrByName, getAllPathsInUrl, getErrorObj, getNumbervalidObj, redirectOnMKTV, redirectOnZGames } from "../helper";

// const MOBILY_Saudia_WEEKLY = 15;
const MOBILY_Saudia_DAILY = 13;
const ZAIN_Saudia_WEEKLY = 103;
const STC_Saudia_DAILY = 10;
const VIRGIN_Saudia_WEEKLY = 38;

const ZAIN_Saudia_WEEKLY_PIN_LENGTH_5 = 5;
const ZAIN_Saudia_WEEKLY_PIN_LENGTH_6 = 6;
const MOBILY_Saudia_PIN_LENGTH_5 = 5;
// const MOBILY_Saudia_PIN_LENGTH_6 = 6;
const STC_Saudia_DAILY_PIN_LENGTH = 4;
const VIRGIN_SAUDIA_PIN_LENGTH = 4

const validateNumberSA = (number) => {
    if (number.trim().length === 0) {
        return getErrorObj("Please enter Valid number");
    }

    let msisdn = number;

    if (msisdn.substring(0, 7) === "0096605") {
        msisdn = `05${msisdn.substring(7)}`;
    } else if (msisdn.substring(0, 6) === "009665") {
        msisdn = `05${msisdn.substring(6)}`;
    } else if (msisdn.substring(0, 5) === "09665") {
        msisdn = `05${msisdn.substring(5)}`;
    } else if (msisdn.substring(0, 5) === "96605") {
        msisdn = `05${msisdn.substring(5)}`;
    } else if (msisdn.substring(0, 4) === "9665") {
        msisdn = `05${msisdn.substring(4)}`;
    } else if (msisdn.substring(0, 3) === "905") {
        msisdn = `05${msisdn.substring(3)}`;
    } else if (msisdn.substring(0, 2) === "05") {
        msisdn = `05${msisdn.substring(2)}`;
    } else if (msisdn.substring(0, 1) === "5") {
        msisdn = `05${msisdn.substring(1)}`;
    } else {
        return getErrorObj("Please enter Valid number");
    }

    let numero = msisdn.substring(0, 3);
    let initial = msisdn.substring(0, 3);

    let slicemsisdn = msisdn.substring(1, msisdn.length);
    msisdn = `966${slicemsisdn}`;

    if (msisdn.length !== 12) {
        return getErrorObj("Please enter Valid number");
    } else {
        return getNumbervalidObj(initial, numero, msisdn);
    }

}

class ConfigManager {
    // singleton instance
    static instance = null;
    cricwick = "http://cricwick.net/knect/";
    pinflowZain = "http://44.224.168.120:8078/api/";
    pinflow = "http://44.224.168.120:8078/gago/";
    configuration = {
        sa: {
            services: [
                {
                    PARTNER_ID: 2,
                    CAMPAIGN_ID: 18,
                    SERVICE_ID: ZAIN_Saudia_WEEKLY,//zain
                    PREFIX: ["058", "059"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflowZain}send_pin?service_id=${this.configuration.sa.services[0].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[0].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[0].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflowZain}confirm_pin?service_id=${this.configuration.sa.services[0].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[0].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[0].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === ZAIN_Saudia_WEEKLY_PIN_LENGTH_5 || pin.length === ZAIN_Saudia_WEEKLY_PIN_LENGTH_6) {
                            return true
                        }
                        return false;
                    },
                    startRedirection: (number, medium) => {
                        redirectOnZGames(number);
                    }
                },
                {
                    PARTNER_ID: 2,
                    CAMPAIGN_ID: 18,
                    SERVICE_ID: MOBILY_Saudia_DAILY,//Mobily
                    PREFIX: ["054", "056"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.sa.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.sa.services[1].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[1].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[1].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === MOBILY_Saudia_PIN_LENGTH_5 || pin.trim().length === MOBILY_Saudia_PIN_LENGTH_5) {
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
                    CAMPAIGN_ID: 18,
                    SERVICE_ID: STC_Saudia_DAILY,//STC
                    PREFIX: ["050", "053", "055"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.sa.services[2].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[2].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[2].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.sa.services[2].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[2].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[2].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === STC_Saudia_DAILY_PIN_LENGTH) {
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
                    CAMPAIGN_ID: 18,
                    SERVICE_ID: VIRGIN_Saudia_WEEKLY,//Virgin
                    PREFIX: ["057"],
                    header: null,
                    pinFlow: {
                        getSendPinUrl: ({ ip, subSrc, number, userAgent }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}send_pin?service_id=${this.configuration.sa.services[3].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[3].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[3].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&user_agent=${userAgent}`;
                        },
                        getConfirmPinUrl: ({ ip, subSrc, number, userAgent, pin }) => {
                            let partner_id = getParametrByName("partner_id");
                            return `${this.pinflow}confirm_pin?service_id=${this.configuration.sa.services[3].SERVICE_ID}&partner_id=${partner_id ? partner_id : this.configuration.sa.services[3].PARTNER_ID}&sub_source=${subSrc}&campaign_id=${this.configuration.sa.services[3].CAMPAIGN_ID}&user_ip=${ip}&msisdn=${number}&pincode=${pin.trim()}&user_agent=${userAgent}`;
                        },
                        isMcpEnabled: false,
                        mcpScript: () => ``
                    },
                    validatePINLength: (pin) => {
                        if (pin.length === VIRGIN_SAUDIA_PIN_LENGTH) {
                            return true
                        }
                        return false;
                    },
                    startRedirection: (number, medium) => {
                        redirectOnMKTV(number);
                    }
                },

            ],
            languages: ["en", "ar"],
            price_points: {
                en: () => {
                    let allPaths = getAllPathsInUrl(window.location.pathname);
                    if (allPaths.includes('mobily')) {
                        return `The service is available for Mobily customers for 1.15 SAR renewed daily. (including VAT). To cancel your subscription, please send U 15 to 600159. The Tax amount was collected to prepaid customers upon charging`
                    }
                    return `
                    STC: This service is available to Saudi Telecom Company customers for 1 SR Daily for prepaid customers and for 34.5 SR for postpaid customers, renewed monthly (including value-added tax). To cancel the subscription, please send U 5 to 801761.
                    Mobily: The service is available for Mobily customers for 1.15 SAR renewed daily. (including VAT). To cancel your subscription, please send U 15 to 600159. The Tax amount was collected to prepaid customers upon charging
                    Zain: The service price is 5 SAR per week and renewed weekly. To cancel the service at any time please send U2 to 704441
                    Virgin: The service price is 5 SAR per week and renewed weekly after 1 day free trial (For new users only). To cancel your subscription please send U2 to 300389
                    `
                },
                ar: () => {
                    let allPaths = getAllPathsInUrl(window.location.pathname);
                    if (allPaths.includes('mobily')) {
                        return `الخدمة متاحة لعملاء موبايلي مقابل 1.15 ريال متجدد يومياً. (بما في ذلك ضريبة القيمة المضافة). لإلغاء اشتراكك ، يرجى إرسال U 15 إلى 600159. تم تحصيل مبلغ الضريبة لعملاء الدفع المسبق عند تحصيل الرسوم`
                    }
                    return `STC: هذه الخدمة متاحة مقابل 1 ريال يوميا لعملاء الدفع المسبق و 34.5 ريال لعملاء الدفع الآجل ، وتجدد شهريا (شامل ضريبة القيمة المضافة) لإلغاء الاشتراك أرسل U 5 إلى 801761.
                    \nMobily: الخدمة متاحة لعملاء موبايلي مقابل 1.15 ريال متجدد يومياً. (بما في ذلك ضريبة القيمة المضافة). لإلغاء اشتراكك ، يرجى إرسال U 15 إلى 600159. تم تحصيل مبلغ الضريبة لعملاء الدفع المسبق عند تحصيل الرسوم
                    \nZAIN: سعر الخدمة 5 ريال أسبوعياً وتجدد أسبوعياً، لإلغاء الخدمة في أي وقت أرسل U2 إلى 704441
                    \nVirgin: سعر الخدمة 5 ريال في الأسبوع وتجدد أسبوعيًا بعد يوم تجريبي مجاني (للمستخدمين الجدد فقط). لإلغاء اشتراكك ، برجاء إرسال U2 إلى 300389
                    `
                },
            },
            placeHolder: "966 XXXXXXXXX"
            ,
            validateNum: (number) => {
                return validateNumberSA(number)
            },
            getValidServices: () => {
                // eslint-disable-next-line
                let allPaths = getAllPathsInUrl(window.location.pathname);
                // if (allPaths.includes('skd')) {
                //     return [telenor_pakistan_free_weekly];

                // }
                return [MOBILY_Saudia_DAILY, ZAIN_Saudia_WEEKLY, STC_Saudia_DAILY, VIRGIN_Saudia_WEEKLY];
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

