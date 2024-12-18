import React from "react";
import { FaUser } from "react-icons/fa6";

const Navbar = () => {
  return (
    
    <div className="flex justify-between w-full h-[62px] border-b bg-gray-100 p-4">
      <div className="flex justify-center">
          <div class="relative flex items-center w-72 xl:w-96">
              <input id="searchInput" class="appearance-none w-full py-2 pl-5 text-gray-900 focus:outline-none rounded-full text-sm pr-[52px] bg-gray-50 border border-gray-200" autocomplete="off" type="text" placeholder="Search something here" name="search" />
              <button type="submit" class="absolute right-0 bg-bChkRed hover:bg-red-500 px-2 py-[17.5px] text-white h-full border border-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-search w-5 h-5" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
              </button>
          </div>
      </div>
    <div className="flex items-center justify-center space-x-2">
      <div className="rounded-full bg-gray-200 text-white p-3">
        <FaUser size={20}/>
      </div>
      <div className="">
        <p className="font-medium">Bismark Gyebi Duah</p>
        <p className="text-gray-600 text-xs">nyarko@gmai.com</p>
      </div>
    </div>
  </div>
  );
};

export default Navbar;

