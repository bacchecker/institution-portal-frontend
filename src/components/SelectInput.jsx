import React, { useState, useRef, useEffect } from "react";
import LoadItems from "./LoadItems";

function SelectInput({
  data = [],
  onItemSelect,
  inputValue,
  className,
  placeholder,
  onItemRemove,
  removeSelected,
  isLoading,
  isFetching,
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-cover" ref={dropdownRef}>
      <div
        className="dropdown"
        onClick={() => setIsDropdownActive((prev) => !prev)}
      >
        <div
          className={`dropdown-btn dropdown-btn-mobile ${className} z-[1] capitalize`}
        >
          {inputValue ? inputValue : placeholder ?? "Select"}
          <i class="bx bx-chevron-down item-abs-center md:right-[1vw] right-[2vw] text-[1.2vw]"></i>
          {/* <img
            id="arrowDown"
            src="/assets/img/arr-down.svg"
            alt=""
            className="item-abs-center md:right-[1vw] right-[2vw] md:w-[0.7vw] w-[3vw] rotate-img capitalize"
          /> */}
          {inputValue && removeSelected && (
            <img
              src="/assets/img/close.svg"
              alt=""
              className="close-w"
              onClick={onItemRemove}
            />
          )}
        </div>
        {isDropdownActive && (
          <div
            className={`dropdown-content-cover dropdown-btn-mobile1 z-[1] ${className}`}
          >
            <div className={"dropdown-content dropdown-content-mobile"}>
              {!isFetching && !isLoading ? (
                <>
                  {data.length > 0 ? (
                    data.map((item, i) => (
                      <div
                        key={i}
                        className="dropdown-item capitalize"
                        onClick={() => {
                          onItemSelect(item);
                        }}
                      >
                        {item?.name || item?.title || item?.document_type?.name}
                      </div>
                    ))
                  ) : (
                    <div className="no-data-found">
                      <h4 className="md:text-[0.9vw] text-[3.5vw] text-center">
                        No Data Found
                      </h4>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center w-full">
                  <LoadItems />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectInput;
