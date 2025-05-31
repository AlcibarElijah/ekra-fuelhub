export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const isValidDate = (dateInput) => {
  const date = new Date(dateInput);

  // check if date is valid
  if(isNaN(date.getTime())) return false;

  return true;
}

export const filterObjectWithValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}