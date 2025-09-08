const storeInSession = (key, value) => {
    sessionStorage.setItem(key, value);
}

const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) => {
    sessionStorage.removeItem(key);
}

const logOutUser = () => {
    sessionStorage.clear();
}

export { storeInSession, lookInSession, removeFromSession, logOutUser };
