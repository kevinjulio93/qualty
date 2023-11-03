export const putElementAtFirst = (collection, key, value) => {
    const indexToMove = collection.findIndex(item => item[key] === value);
    if (indexToMove !== -1) {
        const elementToMove = collection.splice(indexToMove, 1)[0];
        collection.unshift(elementToMove);
    }
    return collection;
}