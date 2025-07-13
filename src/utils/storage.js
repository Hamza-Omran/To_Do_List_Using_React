export const loadFromStorage = (key) => {
    const data = localStorage.getItem(key);
    return data? JSON.parse(data) : [];
};

export const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const removeFromStorage = (key) => {
    localStorage.removeItem(key);
};
