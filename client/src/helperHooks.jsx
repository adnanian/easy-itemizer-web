import { useEffect, useState, useRef } from "react";

/**
 * Generates a reusable popup dialog.
 * 
 * NOTE: To effectively use this, you need to declare the useModal() hook on the
 * parent component and pass the modalActive state to openModal and the toggle
 * function to closeModal.
 * 
 * @param {Object} param0 
 * @param {Boolean} param0.openModal if true, then the popup will show.
 * @param {Function} param0.closeModal 
 * @param {*} param0.children the child elements and components.
 * @returns a popup and any children rendered under it.
 */
function Modal( { openModal, closeModal, children } ) {
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
 * Reference: https://betterprogramming.pub/create-a-custom-usemodal-react-hook-449b5909cc09
 * 
 * @returns an object for managing modal settings.
 */
export const useModalManager = () => {
    const [modalActive, setModalActive] = useState(false);
    const [modalChild, setModalChild] = useState(null);

    /**
     * TODO
     * 
     * @param {*} component 
     */
    const showView = (component) => {
        setModalChild(component);
        setModalActive(true);
    }

    /**
     * TODO
     */
    const clearView = () => {
        setModalActive(false);
        setModalChild(null);
    }

    const toggleTrigger = () => {
        setModalTriggered(!modalTriggered);
    }

    /**
     * 
     */
    const modalManager = Object.freeze({
        showView: showView,
        clearView: clearView,
        modal: (
            <Modal openModal={modalActive} closeModal={clearView}>
                {modalChild}
            </Modal>
        )
    });

    return modalManager;
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

/**
 * Article of Reference: https://medium.com/@josephat94/building-a-simple-react-hook-to-detect-screen-size-404a867fa2d2
 */
export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    /**
     * TODO
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

    const mainScreenSizeAverage = (MainScreenSize.WIDTH + MainScreenSize.HEIGHT) / 2;
    
    const currentScreenSizeAverage = () => (screenSize.width + screen.height) / 2;

    // console.log(mainScreenSizeAverage);
    // console.log(currentScreenSizeAverage());

    // console.log(screenSize);

    const scaleByWidth = (originalSize, unit) => {
        // return BW/sw = BF/sf BWsf=swBF sf=swBF/BW
        const scaledValue = `${screenSize.width * originalSize / MainScreenSize.WIDTH}${unit}`;
        // console.log(scaledValue);
        return scaledValue;
    };

    const scaleByHeight = (originalSize, unit) => {
        const scaledValue = `${screenSize.height * originalSize / MainScreenSize.HEIGHT}${unit}`;
        // console.log(scaledValue);
        return scaledValue;
    }

    const scaleByRatio = (originalSize, unit) => {
        // const originalX = Math.sqrt(MainScreenSize.WIDTH * originalSize / MainScreenSize.HEIGHT);
        // const originalY = originalSize / originalX;

        // const x = screenSize.width * originalX / MainScreenSize.WIDTH;
        // const y = screenSize.height * originalY / MainScreenSize.HEIGHT;
        // const scaledValue = `${x * y}${unit}`;
        // // console.log(scaledValue);
        // return scaledValue;
        return `${(screenSize.width * screenSize.height * originalSize)/(MainScreenSize.WIDTH * MainScreenSize.HEIGHT)}${unit}`;
    }   

    return {scaleByWidth, scaleByHeight, scaleByRatio};
}

/**
 * TODO
 * 
 * @param {*} operation the mathematical operation; must be "PLUS" or "MINUS" case-insensitive, or an error will occur.
 * @returns 
 */
export const useQuantityAdjuster = (operation) => {
    const [targetOperation, setTargetOperation] = useState(operation.toUpperCase());

    const quantityAdjusters = Object.freeze({
        PLUS: (initialValue, addend) => (initialValue + addend),
        MINUS: (initialValue, subtrahend) => (initialValue - subtrahend)
    });

    const quantityAdjuster = {
        adjustQuantity: (initialValue, adjuster) => quantityAdjusters[targetOperation](initialValue, adjuster),
        targetOperation: targetOperation,
        setTargetOperation: (operation) => setTargetOperation(operation.toUpperCase())
    }

    return quantityAdjuster;
}

// export const useQuantityAdjuster = Object.freeze({
//     PLUS: (initialValue, addend) => (initialValue + addend),
//     MINUS: (initialValue, subtrahend) => (initialValue, subtrahend)
// });
