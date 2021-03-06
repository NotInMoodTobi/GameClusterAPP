import React, { useState, useCallback } from "react";
import { Disclosure } from "@headlessui/react";
import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/solid";
import AddGameModal from "./AddGameModal";
import clsx from "clsx";
import { useGameContext } from "../contexts/games";

interface ISidebar {
  handleGameSearch: Function;
  handleArchived?: Function;

  setFilterState: (state: FilterState) => void;
  filterState: FilterState;
}

export interface FilterState {
  search: string | false;
  archived: boolean;
  favourite: boolean;
}

const Sidebar: React.FC<ISidebar> = (props) => {
  const { setFilterState, filterState } = props;
  const [openModal, setOpenModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [gameList, setGamesList] = useGameContext();

  const handleFavouriteChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.target.checked) {
        setFilterState({
          favourite: e.target.checked,
          search: false,
          archived: false,
        });
      } else {
        setFilterState({
          ...filterState,
          favourite: false,
        });
      }
    },
    [filterState, setFilterState]
  );

  const handleArhivedChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.target.checked) {
        setFilterState({
          archived: e.target.checked,
          search: false,
          favourite: false,
        });
      } else {
        setFilterState({
          ...filterState,
          archived: false,
        });
      }
    },
    [filterState, setFilterState]
  );

  return (
    <>
      <div className="md:w-64 z-50">
        <div className="md:fixed top-0 " style={{ width: "inherit" }}>
          <div
            className={clsx(
              "flex flex-col w-full h-screen overflow-hidden px-4 py-8 border-r bg-gray-700 border-gray-600 fixed sm:fixed md:relative z-20",
              showMenu && "invisible md:visible"
            )}
          >
            <h2 className="text-3xl font-semibold text-white">Game Cluster</h2>
            <div className="relative mt-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
              <input
                type="text"
                className="w-full py-3 pl-10 pr-4 border rounded-md bg-gray-600 text-gray-100 border-gray-600 focus:border-elue-500 focus:outline-none focus:ring"
                placeholder="Search"
                onChange={(e) => {
                  props.handleGameSearch(e.target.value);
                }}
                value={filterState.search ? filterState.search : ""}
              />
            </div>

            <div className="flex items-center px-4 pt-4">
              <button
                className="flex flex-row"
                onClick={() => setOpenModal(true)}
              >
                <div className="top-1/2 absolute">
                  <AddGameModal
                    showModal={openModal}
                    closeModalHandler={() => setOpenModal(false)}
                  />
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 border-gray-300 rounded "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <label className="ml-3 min-w-0 flex-1 text-gray-200 cursor-pointer">
                  Add Game
                </label>
              </button>
            </div>
            <div className="flex items-center px-4 pt-4">
              <input
                name="Archived"
                defaultValue="Archived"
                type="checkbox"
                className="h-6 w-6 rounded text-gray-600 focus:ring-gray-600"
                onChange={handleArhivedChange}
                checked={filterState.archived}
              />
              <label className="ml-3 min-w-0 flex-1 text-gray-200 cursor-pointer">
                Archived
              </label>
            </div>
            <div className="flex items-center px-4 pt-4">
              <input
                name="Favorite"
                defaultValue="Favorites"
                type="checkbox"
                className="h-6 w-6 rounded text-gray-600 focus:ring-gray-600"
                onChange={handleFavouriteChange}
                checked={filterState.favourite}
              />
              <label className="ml-3 min-w-0 flex-1 text-gray-200">
                Favorite
              </label>
            </div>
          </div>

          <div className="z-10 visible md:invisible w-full h-12 fixed mb-10 bg-white text-xl font-semibold py-2 px-2">
            GC
          </div>
          <input
            type="text"
            className={clsx(
              "fixed h-8 z-10 right-0 mr-12 mt-2 border rounded-md bg-gray-100 md:bg-gray-600 text-gray-600 md:text-gray-100 border-gray-600 ",
              showMenu && "visible md:visible"
            )}
            placeholder="Search"
            onChange={(e) => {
              props.handleGameSearch(e.target.value);
            }}
          />
          <span
            className="z-20 fixed cursor-pointer md:invisible top-0 right-0 p-2 flex flex-row"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
