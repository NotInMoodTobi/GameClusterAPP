import { FunctionComponent, useCallback } from "react";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useGameContext, IGame } from "../contexts/games";
import "react-toastify/dist/ReactToastify.css";
import { ToastWarning, ToastSuccess } from "../emitter/Toast";
import {
  apiGameToUiGame,
  deleteGame,
  getAllGames,
  updateGame,
} from "../api/games";

interface IEditGameModal {
  showModal: boolean;
  closeModalHandler: Function;
  game: IGame;
}

interface Field {
  label: string;
  name: keyof IGame;
}

const EditGameModal: FunctionComponent<IEditGameModal> = (props) => {
  const [gameList, setGamesList] = useGameContext();
  const cancelButtonRef = useRef(null);

  let newName: string;
  let newGenre: string;
  let newImg: string;

  const editableValues: Field[] = [
    { label: "Name", name: "name" },
    { label: "Description", name: "description" },
    { label: "Image (URL)", name: "header_image_path" },
    { label: "Age Rating", name: "required_age" },
    { label: "Game Rating", name: "metascore" },
  ];

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const body = Array.from(formData.entries()).reduce<
        Partial<Record<Field["name"], string>>
      >((acc, [name, value]) => {
        return { ...acc, [name]: value };
      }, {});

      updateGame(body as unknown as IGame, props.game.game_id).then(() => {
        getAllGames().then((games) => {
          console.log("got new games", games);
          setGamesList((state) => ({
            ...state,
            games: games.map(apiGameToUiGame),
          }));
          props.closeModalHandler();
        });
      });
    },
    [props.game.game_id, setGamesList, props.closeModalHandler]
  );

  const handleDeleteGame = () => {
    deleteGame(props.game.game_id).then(() => {
      getAllGames().then((games) => {
        console.log("got new games", games);
        setGamesList((state) => ({
          ...state,
          games: games.map(apiGameToUiGame),
        }));
        props.closeModalHandler();
      });
    });
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
                <form
                  className="mt-2 flex flex-col gap-5"
                  onSubmit={handleSubmit}
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-bold text-gray-900"
                        >
                          Edit Game
                        </Dialog.Title>
                        <div className="mt-2 grid grid-cols-2 gap-5">
                          {editableValues.map((current, index) => (
                            <div>
                              <label
                                htmlFor="Title"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {current.label}
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  id={`${current.label}`}
                                  type="text"
                                  name={`${current.name}`}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                  defaultValue={String(
                                    props.game[current.name] ?? ""
                                  )}
                                />
                              </div>
                            </div>
                          ))}
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
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Edit Game
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => handleDeleteGame()}
                    >
                      Delete Game
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default EditGameModal;
