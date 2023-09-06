export const checkPermissions = (permissions, abilities): boolean => {
    const { subject, action } = permissions;
    const index = abilities.findIndex((ability) => ability.subject === subject);
    return index === -1 ? false : action.every((current: string) => abilities[index].action.includes(current));
}