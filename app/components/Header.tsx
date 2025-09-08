import type { JSX } from "react";
import { useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { Navigation } from "./Navigation";
import { ScanButton } from "./ScanButton";
import { Link } from "react-router";
import { FileText } from "lucide-react";

interface HeaderProps {
  onUploadSuccess?: () => void;
}

const Header = ({ onUploadSuccess }: HeaderProps): JSX.Element => {
	const [open, setOpen] = useState(false);
	const toggleFunction = () => {
		setOpen(prev => !prev);
	};

  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  return (
    <header className="relative bg-custom-purple text-white px-1 sm:px-4 py-2 sm:py-3 flex justify-between items-center border-b-2 border-white">
    <h1>
      <Link to="/">
        <img 
          src="/tornado-02-front/image/viofolio.png" 
          alt="Viofolio" 
          className="h-10 sm:h-12" 
        />
      </Link>
    </h1>
      {isLoggedIn && (
        <>
          <div className="flex justify-end items-center gap-3">
            <ScanButton onUploadSuccess={onUploadSuccess} />

          <button className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white flex items-center justify-center shadow-md">
            <Link to="/summary">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-custom-purple" />
            </Link>
          </button>

            <ToggleButton
              open={open}
              controls="navigation"
              label="メニューを開きます"
              onClick={toggleFunction}
            />
          </div>
          <Navigation id="navigation" open={open} />
        </>
      )}
    </header>
  );
};

export default Header;

