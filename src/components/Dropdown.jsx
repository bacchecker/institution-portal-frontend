import React, { useState, useRef, useEffect } from "react";

function Dropdown({
  buttonContent,
  children,
  buttonClass,
  dropdownClass,
  openDropDownFilter,
  setOpenDropDownFilter,
  isClose
}) {
  const [openFilter, setOpenFilter] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("top");
  const filterDropdownRef = useRef();
  const dropdownRef = useRef();

  const isControlled =
    openDropDownFilter !== undefined && setOpenDropDownFilter !== undefined;

  const handleToggle = () => {
    if (isControlled) {
      setOpenDropDownFilter((prev) => !prev);
    } else {
      setOpenFilter((prev) => !prev);
    }
  };

  

  const isOpen = isControlled ? openDropDownFilter : openFilter;


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        if (isControlled) {
          setOpenDropDownFilter(false);
        } else {
          setOpenFilter(false);
        }
      }

      if (isClose) {
        if (isControlled) {
          setOpenDropDownFilter(false);
        } else {
          setOpenFilter(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isControlled, setOpenDropDownFilter, isClose]);

  const updateDropdownPosition = () => {
    if (dropdownRef.current && filterDropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const buttonRect = filterDropdownRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (dropdownRect.height > spaceBelow && spaceAbove > spaceBelow) {
        setDropdownPosition("bottom");
      } else {
        setDropdownPosition("top");
      }
    }
  };

  useEffect(() => {
    const handleResizeOrScroll = () => {
      updateDropdownPosition();
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen]);

  return (
    <div className="relative w-[fit-content]" ref={filterDropdownRef}>
      <button className={`${buttonClass}`} onClick={handleToggle}>
        {buttonContent}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-[22] right-0 ${
            dropdownPosition === "top" ? "top-[110%]" : "bottom-[110%]"
          } h-[fit-content] border border-[#e0e0e0] shadow-lg bg-white rounded-[0.5rem] ${dropdownClass}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
