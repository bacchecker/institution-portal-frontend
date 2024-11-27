import React, { useState, useRef, useEffect } from "react";
import LoadItems from "./LoadItems";

function SearchSelectInput({
  data = [],
  onItemSelect,
  className = "",
  inputValue,
  placeholder,
  isLoading,
  isFetching,
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [searchYear, setSearchYear] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (inputValue) {
      setSearchYear(inputValue);
    } else {
      setSearchYear("");
    }
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownActive(false);
        if (inputValue) {
          setSearchYear(inputValue);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputValue]);

  const filteredData = data?.filter(
    (item) =>
      item?.title?.toLowerCase()?.includes(searchYear?.toLowerCase()) ||
      item?.name?.toLowerCase()?.includes(searchYear?.toLowerCase()) ||
      item?.country?.toLowerCase()?.includes(searchYear?.toLowerCase())
  );

  return (
    <div className="dropdown-cover" ref={dropdownRef}>
      <div
        className="dropdown"
        onClick={() => setIsDropdownActive((prev) => !prev)}
      >
        <div
          className={`dropdown-btn dropdown-btn-mobile ${className} ${
            !searchYear ? "text-[#666f75a3]" : "text-[#262626]"
          } ${isDropdownActive && "focus1"} ${
            searchYear && "border-active"
          } z-[1]`}
        >
          <input
            type="text"
            placeholder={placeholder}
            className="w-full outline-none border-none z-[1] bg-transparent"
            value={searchYear}
            onChange={(event) => setSearchYear(event.target.value)}
            onFocus={() => setSearchYear("")}
          />
          <img
            id="arrowDown"
            src="/assets/img/arr-down.svg"
            alt=""
            className="item-abs-center md:right-[1vw] right-[2vw] md:w-[0.7vw] w-[3vw] rotate-img"
          />
        </div>
        {isDropdownActive && (
          <div
            className={`dropdown-content-cover dropdown-btn-mobile1 z-[1] ${className}`}
          >
            <div className="dropdown-content dropdown-content-mobile">
              {!isFetching && !isLoading ? (
                <>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, i) => (
                      <div
                        key={i}
                        className="dropdown-item"
                        onClick={() => {
                          onItemSelect(item);
                          setSearchYear(item?.title || item?.name || item?.country);
                        }}
                      >
                        {item?.title || item?.name || item?.country}
                      </div>
                    ))
                  ) : (
                    <div className="no-data-found w-full justify-center flex">
                      <h4 className="md:text-[1vw] text-[3.5vw]">No Data Found</h4>
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

export default SearchSelectInput;
