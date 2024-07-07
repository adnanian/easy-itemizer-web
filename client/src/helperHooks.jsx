import { useEffect, useState, useRef } from "react";

/**
 * Generates a reusable popup dialog.
 * 
 * NOTE: To effectively use this, you need to declare the useModalManager() hook on the
 * parent component and pass the modalActive state to openModal and the toggle
 * function to closeModal.
 * 
 * @param {Object} param0 
 * @param {Boolean} param0.openModal if true, then the popup will show.
 * @param {Function} param0.closeModal the callback function for closing the modal.
 * @param {*} param0.children the child elements and components.
 * @returns a popup and any children rendered under it.
 */
function Modal({ openModal, closeModal, children }) {
    const ref = useRef();
    //console.log(console.log(`Open Modal: ${openModal}`));

    /**
     * "?." - known as the optional chaning operator.
     * According to MDN, it will either access the object's property or call its function.
     * If the object itself is undefined or null, then the entire expression evaluates to undefined,
     * instead of throwing an error.
     * 
     * Sources: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
     *          https://medium.com/@dimterion/modals-with-html-dialog-element-in-javascript-and-react-fb23c885d62e
     *          https://medium.com/web-development-with-sumit/useref-vs-usestate-in-react-330539025245#:~:text=serve%20different%20purposes.-,useRef%20is%20primarily%20used%20to%20access%20and%20manipulate%20the%20DOM,renders%20when%20the%20state%20updates.
     * 
     */
    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return (
        <dialog ref={ref} onCancel={closeModal}>
            {children}
            <button onClick={closeModal}>Close</button>
        </dialog>
    );
}


/**
 * Custom hook for managing the use of dialogs and modals in React components.
 * Declaring this hook inside a component will allow you access to an instance of
 * the Modal component where you can programmatically pass any child/children
 * JSX.
 * 
 * NOTE: TO PREVENT ERRORS AND WARNINGS, CALL THIS HOOK AT THE BEGINNING OF YOUR
 * COMPONENT BODY.
 * 
 * Reference: https://betterprogramming.pub/create-a-custom-usemodal-react-hook-449b5909cc09
 * 
 * @returns an object for managing modal settings.
 */
export const useModalManager = () => {
    const [modalActive, setModalActive] = useState(false);
    const [modalChild, setModalChild] = useState(null);

    /**
     * Displays a dialog with a given child component.
     * 
     * @param {Function} component the component to render inside the <Modal/> component.
     */
    const showView = (component) => {
        setModalChild(component);
        setModalActive(true);
    }

    /**
     * Closes the dialog and removes the children of <Modal/> 
     */
    const clearView = () => {
        setModalActive(false);
        setModalChild(null);
    }

    /**
     * Allows the ability to open/close a modal and set
     * its child component.
     */
    const modalManager = Object.freeze({
        /** Displays the modal and passes a child. */
        showView: showView,
        /** Closes the modal and clears the child. */
        clearView: clearView,
        /**
         * Retrieves an modal component with its child.
         */
        modal: (
            <Modal openModal={modalActive} closeModal={clearView}>
                {modalChild}
            </Modal>
        )
    });

    return modalManager;
}

/**
 * Navigates your current application to a given route
 * after a given amount of time elapses.
 * 
 * @param {Function} navigate the navigate function (that is assigned by using useNavigate inside the component.)
 * @param {String} route the route to navigate to.
 * @param {Number} loadingTimeLimit the amount of time to wait in milliseconds.
 * @returns the clearTimeout function in the event that another event triggers setTimeout cancellation.
 */
export const useLoadingTimer = (navigate, route, loadingTimeLimit) => {
    const timer = setTimeout(() => navigate(route), loadingTimeLimit);
    return () => clearTimeout(timer);
};

/**
 * Allows programmatic manipulation of element sizing, margins, and padding.
 * This is used for inline styling.
 * 
 * NOTE: THIS HOOK MUST BE DECLARED AT THE BEGINNING OF THE COMPONENT BODY AND AFTER useModalManager
 * TO PREVENT ERRORS AND WARNINGS.
 * 
 * Article of Reference: https://medium.com/@josephat94/building-a-simple-react-hook-to-detect-screen-size-404a867fa2d2
 * 
 * @returns a destructured set of functions for adjusting element sizing and positioning.
 */
export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    /**
     * The web page screen size on the monitor that I
     * developed this application on. All scaling will
     * be calculated from this base origin.
     */
    const MainScreenSize = Object.freeze({
        WIDTH: 1920,
        HEIGHT: 911
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
    }, []);

    // console.log(mainScreenSizeAverage);
    // console.log(currentScreenSizeAverage());

    // console.log(screenSize);

    /**
     * Scales a horizontal-based value by using the ratio of the original
     * screen size and current screen size.
     * 
     * @param {Number} originalSize the size that's used in the original screen size.
     * @param {String} unit the unit, such as 'px', 'em', '%', etc.
     * @returns the scaled horizontal value appended by the unit.
     */
    const scaleByWidth = (originalSize, unit) => {
        // return BW/sw = BF/sf BWsf=swBF sf=swBF/BW
        const scaledValue = `${screenSize.width * originalSize / MainScreenSize.WIDTH}${unit}`;
        // console.log(scaledValue);
        return scaledValue;
    };

    /**
     * Scales a vertical-based value by using the ratio of the original
     * screen size and current screen size.
     * 
     * @param {Number} originalSize the size that's used in the original screen size.
     * @param {String} unit the unit, such as 'px', 'em', '%', etc.
     * @returns the scaled vertical value appended by the unit.
     */
    const scaleByHeight = (originalSize, unit) => {
        const scaledValue = `${screenSize.height * originalSize / MainScreenSize.HEIGHT}${unit}`;
        // console.log(scaledValue);
        return scaledValue;
    }

    /**
     * Scales an area-based value, such as font size, by using the ratio of the original
     * screen size and current screen size.
     * 
     * @see README.md for details on how this is calculated.
     * 
     * @param {Number} originalSize the original size.
     * @param {String} unit the unit, such as 'px', 'em', '%', etc.
     * @returns the scaled value appended by the unit.
     */
    const scaleByRatio = (originalSize, unit) => {
        return `${(screenSize.width * screenSize.height * originalSize) / (MainScreenSize.WIDTH * MainScreenSize.HEIGHT)}${unit}`;
    }

    return { scaleByWidth, scaleByHeight, scaleByRatio };
}

/**
 * DRY hook for handling additions and subtractions of AssignedItemCard minus and
 * plus button clicks, since they both have similar events.
 * 
 * @param {String} operation the mathematical operation; must be "PLUS" or "MINUS" case-insensitive, or an error will occur.
 * @returns an object of functions to allow switching between adding and subtracting.
 */
export const useQuantityAdjuster = (operation) => {
    const [targetOperation, setTargetOperation] = useState(operation.toUpperCase());

    /**
     * Adds or subtracts the current quantity.
     */
    const quantityAdjusters = Object.freeze({
        PLUS: (initialValue, addend) => (initialValue + addend),
        MINUS: (initialValue, subtrahend) => (initialValue - subtrahend)
    });

    /**
     * Manages settings for quantity adjustment.
     */
    const quantityAdjuster = Object.freeze({
        /**
         * Adds or subtracts the current quantity.
         * 
         * @param {Number} initialValue the current quantity.
         * @param {Number} adjuster the number to add to / subtract from.
         * @returns the new quantity
         */
        adjustQuantity: (initialValue, adjuster) => quantityAdjusters[targetOperation](initialValue, adjuster),
        /** The target mathematical operation. */
        targetOperation: targetOperation,

        /**
         * Calls the setter for the targetOperation state value.
         * 
         * @param {String} operation the new mathematical operation; must be PLUS or MINUS.
         * @returns the setter for the targetOperation state value.
         */
        setTargetOperation: (operation) => setTargetOperation(operation.toUpperCase())
    });

    return quantityAdjuster;
}

/**
 * Allows dry manipulation of page titles.
 * 
 * @param {String} defaultTitle the default title.
 * @returns an object for managing title settings.
 */
export const useTitleManager = (defaultTitle) => {
    const [defaultTitleText, setDefaultTitleText] = useState(defaultTitle);
    const [title, setTitle] = useState(defaultTitleText);

    const setLoadingTitle = (loadingTitle) => setTitle(loadingTitle);
    const revertToDefault = () => setTitle(defaultTitleText);

    /**
     * Updates the default title.
     * 
     * @param {String} newDefault the new default title. 
     */
    const setDefault = (newDefault) => {
        setDefaultTitleText(newDefault);
        setTitle(newDefault);
    }

    /**
     * Manages settings for titles.
     */
    const titleManager = {
        /** The title */
        title: title,

        /** Pass a new string to set the current title. */
        setLoadingTitle: setLoadingTitle,
        /** Reverts the current title back to its default text. */
        revertToDefault: revertToDefault,
        /** Sets a new text for the default title. */
        setNewDefault: setDefault
    };
    return titleManager;
}