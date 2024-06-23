import { useEffect, useState } from "react";

/**
 * Reference: https://betterprogramming.pub/create-a-custom-usemodal-react-hook-449b5909cc09
 * Custom hook for managing the use of dialogs and modals in React components.
 * 
 * DELETE THIS HOOK AND USE MODALMANAGER INSTEAD!
 * 
 * @returns a destructured array of a boolean representing whether a modal is open, and a function to open/close the modal.
 */
export const useModal = () => {
    const [modalActive, setModalActive] = useState(false);
    const toggle = () => setModalActive(!modalActive);
    return [modalActive, toggle];
}

/**
 * Custom hook for managing the use of dialogs and modals in React components.
 * 
 * @returns 
 */
export const useModalManager = () => {
    const [modalActive, setModalActive] = useState(false);
    const [modalChild, setModalChild] = useState(null);

    const modalManager = Object.freeze({
        modalActive: modalActive,
        view: modalChild,
        showView: (component) => {
            setModalChild(component);
            setModalActive(true);
        },
        clearView: () => {
            setModalActive(false);
            setModalChild(null);
        }
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
        const originalX = Math.sqrt(MainScreenSize.WIDTH * originalSize / MainScreenSize.HEIGHT);
        const originalY = originalSize / originalX;

        const x = screenSize.width * originalX / MainScreenSize.WIDTH;
        const y = screenSize.height * originalY / MainScreenSize.HEIGHT;
        const scaledValue = `${x * y}${unit}`;
        // console.log(scaledValue);
        return scaledValue;
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
