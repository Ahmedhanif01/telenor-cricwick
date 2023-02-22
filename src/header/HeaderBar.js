import React from "react";
import { LanguageSelection } from "../language-selection/LanguageSelection";

function HeaderBar({ dispatch, lang, languages }) {
  return (
    <section>
      <div className="top-bar">
        <div className="language">
          {/* <img src={getCDNUrl("globe.svg")} alt="" /> {lang === "en" ? "اُردُو‎" : "En"} */}
          <LanguageSelection
            dispatch={dispatch}
            lang={lang}
            languages={languages}
          />
        </div>
      </div>
    </section>
  );
}

export default HeaderBar;
