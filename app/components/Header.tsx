import type { JSX } from "react";
import { useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { Navigation } from "./Navigation";
import { ScanButton } from "./ScanButton";
import { Link } from "react-router";

const Header = (): JSX.Element => {
	const [open, setOpen] = useState(false);
	const toggleFunction = () => {
		setOpen(prev => !prev);
	};

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  return (
    <header className="relative bg-custom-purple text-white px-4 pt-4 pb-2 flex justify-between items-center border-b-2 border-white">
      <h1 className="text-2xl font-bold">
        <Link to="/dashboard">
          <img src="/tornado-02-front/image/viofolio.png" alt="Viofolio" className="h-12" />
        </Link>
      </h1>
      {isLoggedIn && (
        <>
          <ScanButton />
          <ToggleButton
            open={open}
            controls="navigation"
            label="メニューを開きます"
            onClick={toggleFunction}
          />
          <Navigation id="navigation" open={open} />
        </>
      )}
    </header>
  );
};

export default Header;

