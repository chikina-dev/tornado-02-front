import type { JSX } from "react";
import { useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { Navigation } from "./Navigation";
import { ScanButton } from "./ScanButton";

const Header = (): JSX.Element => {
	const [open, setOpen] = useState(false);
	const toggleFunction = () => {
		setOpen(prev => !prev);
	};
  return (
    <header className="relative bg-custom-purple text-white p-4 flex justify-between items-center border-b-2 border-white">
      <h1 className="text-xl font-bold">momonga</h1>
      <ScanButton />
			<ToggleButton
        open={open}
        controls="navigation"
        label="メニューを開きます"
        onClick={toggleFunction}
      />
      <Navigation id="navigation" open={open} />
    </header>
  );
};

export default Header;

