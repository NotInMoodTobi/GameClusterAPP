import { FunctionComponent } from "react";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IGame, useGameContext } from "../contexts/games";
import "react-toastify/dist/ReactToastify.css";
import { ToastWarning, ToastSuccess } from "../emitter/Toast";
import { addGame } from "../api/games";

interface IAddGameModal {
  showModal: boolean;
  closeModalHandler: Function;
}

const AddGameModal: FunctionComponent<IAddGameModal> = (props) => {
  const [gameList, setGamesList] = useGameContext();
  const cancelButtonRef = useRef(null);

  let newName: string;
  let newGenre: string;
  let newImg: string;

  const handleGameName = (e: any) => {
    newName = e.target.value;
  };

  const handleGameGenre = (e: any) => {
    newGenre = e.target.value;
  };

  const handleGameIMG = (e: any) => {
    newImg = e.target.value;
  };

  const handleAddGame = () => {
    if (newName && newGenre && newImg) {
      const newGame: IGame = {
        // id generated from db
        game_id: 0,
        name: newName,
        genre: newGenre,
        header_image_path: newImg,
      };
      addGame(newGame).then((id) => {
        setGamesList((state) => ({
          ...state,
          games: [
            ...state.games,
            {
              ...newGame,
              game_id: id,
            },
          ],
        }));
        ToastSuccess("Succesfully added a game!");
        props.closeModalHandler();
      });
    } else {
      ToastWarning("Please fill out all required Fields");
    }
  };
  return (
    <>
      <Transition.Root show={props.showModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-20 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={props.showModal}
          onClose={() => props.closeModalHandler()}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-bold text-gray-900"
                      >
                        ADD NEW GAME
                      </Dialog.Title>
                      <div className="mt-2 grid grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="Title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              id="name"
                              type="text"
                              name="Title"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => handleGameName(e)}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="Title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Genre
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              id="genre"
                              type="text"
                              name="Title"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => handleGameGenre(e)}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="gameIMG"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Image (URL)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              id="gameIMG"
                              type="text"
                              name="GameIMG"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              onChange={(e) => handleGameIMG(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    ref={cancelButtonRef}
                    onClick={() => props.closeModalHandler()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleAddGame()}
                  >
                    Add Game
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default AddGameModal;
