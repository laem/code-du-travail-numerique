import React from "react";

import { Link } from "../../routes";

const Header = () => (
  <header className="section-white site-header">
    <div className="container">
      <div className="main-header">
        <Link route="index" params={{ q: "" }}>
          <a className="main-header__logo">
            <img src={"/static/assets/img/marianne.svg"} alt="" />
            Code du travail numérique
          </a>
        </Link>
      </div>
    </div>
  </header>
);

export default Header;
