import { createContext, useContext, useRef, useEffect, useState } from "react";

const AccordianContext = createContext();

export default function Accordian({ children, value, onChange, ...props }) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    onChange?.(selected);
  }, [selected]);

  return (
    <ul {...props}>
      <AccordianContext.Provider value={{ selected, setSelected }}>
        {children}
      </AccordianContext.Provider>
    </ul>
  );
}

export function AccordianItem({ children, value, trigger, ...props }) {
  const { selected, setSelected } = useContext(AccordianContext);
  const open = selected === value;

  const ref = useRef(null);

  return (
    <li className="border-b bg-white" {...props}>
      <header
        role="button"
        onClick={() => setSelected(open ? null : value)}
        className={`flex justify-between items-center p-4 font-medium bg-white ${open ? "md:rounded-tl-[0.5vw] md:rounded-tr-[0.5vw] rounded-tl-[1.5vw] rounded-tr-[1.5vw]": "md:rounded-[0.5vw] rounded-[1.5vw]"}`}
      >
        {trigger}
        <i className="bx bx-plus md:text-[1.5vw] text-[3vw]"></i>
      </header>
      <div
        className="overflow-y-hidden transition-all"
        style={{ height: open ? ref.current?.offsetHeight || 0 : 0 }}
      >
        <div className="pt-2 p-4 bg-white md:rounded-bl-[0.5vw] md:rounded-br-[0.5vw] rounded-bl-[1.5vw] rounded-br-[1.5vw]" ref={ref}>
          {children}
        </div>
      </div>
    </li>
  );
}
