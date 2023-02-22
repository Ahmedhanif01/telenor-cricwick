import React, { Suspense, lazy } from 'react';
// import { getCDNUrl } from '../helper/index'

const HeaderTextComponent = lazy(() => import("./HeaderText" /* b */))
function HeaderLogo({ lang }) {
    return (
        <div className="logo-bar">
            <img className="logo" style={{ transition: "height 2s ease-in" }} src="cw_popup_logo.png" alt="logo" />
            <Suspense>
                <HeaderTextComponent lang={lang} />
            </Suspense>
        </div>
    )
}

export default HeaderLogo
