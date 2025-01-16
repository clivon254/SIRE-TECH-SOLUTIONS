

export const getInitials = (fullName) => {

    const names = fullName.split(" ")

    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

    const initialStr = initials.join("")

    return initialStr;

}