import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    cartItems: [],
});

export { useGlobalState, setGlobalState };