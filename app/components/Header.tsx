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
    <header className="relative bg-custom-purple text-white px-4 pt-3 pb-3 flex justify-between items-center border-b-2 border-white">
      <h1 className="text-2xl font-bold">
        <Link to="/">
          <img src="/tornado-02-front/image/viofolio.png" alt="Viofolio" className="h-12" />
        </Link>
      </h1>
      {isLoggedIn && (
        <>
          <div className="flex justify-end items-center gap-3">
            <ScanButton onUploadSuccess={onUploadSuccess} />

            <button className="w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-md">
              <Link to="/summary">
                <FileText className="w-7 h-7 text-custom-purple" />
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

