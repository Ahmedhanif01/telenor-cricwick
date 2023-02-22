import React from 'react'
import language from "../translations";

export default function HeaderText({ lang }) {
    return (
        <div className="centerClass">
            <div className={"moto-2"}>
                {language[lang].watch_live_cricket}
            </div>
            <div className={"moto-2"}>
                {language[lang].videos_highlights}
            </div>
            <div className={"moto-3"}>
                {language[lang].gossips_news}
            </div>
        </div>
    )
}
