/**
 * Reference: https://betterprogramming.pub/create-a-custom-usemodal-react-hook-449b5909cc09
 * Custom hook for managing the use of dialogs and modals in React components.
 * 
 * @returns a destructured array of a boolean representing whether a modal is open, and a function to open/close the modal.
 */
export const useModal = () => {
    const [modalActive, setModalActive] = useState(false);
    const toggle = () => setModalActive(!modalActive);
    return [modalActive, toggle];
}

/**
 * TODO
 * 
 * @param {*} navigate 
 * @param {*} route 
 * @param {*} loadingTimeLimit 
 * @returns 
 */
export const useLoadingTimer = (navigate, route, loadingTimeLimit) => {
    const timer = setTimeout(() => navigate(route), loadingTimeLimit);
    return ()=> clearTimeout(timer);
};
