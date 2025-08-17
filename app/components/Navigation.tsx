import type { FC } from "react";

type Props = {
	open: boolean;
	id: string;
}
export const Navigation: FC<Props> = ({ open, id }) => {
	return(
    <nav
      id={id}
      aria-hidden={!open}
      className={`absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center transition-all duration-300 ${
        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      <ul className="w-full text-center">
        <li className="py-2 border-b border-gray-200">about</li>
        <li className="py-2 border-b border-gray-200">works</li>
        <li className="py-2 py-2">contact</li>
      </ul>
    </nav>		
	);
};