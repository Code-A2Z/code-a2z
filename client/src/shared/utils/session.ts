const storeInSession = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

const lookInSession = (key: string) => {
  return sessionStorage.getItem(key);
};

const removeFromSession = (key: string) => {
  sessionStorage.removeItem(key);
};

const logOutUser = () => {
  sessionStorage.clear();
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };
