export const calculateAge = (birthday) => {
    // Assuming birthday is a string in the format "YYYY-MM-DD"
    const birthDate = new Date(birthday);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has occurred this year
    const isBirthdayPassed = (
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())
    );

    if (!isBirthdayPassed) {
        // If the birthday hasn't occurred yet this year, subtract 1 from the age
        age--;
    }

    return age;
}
