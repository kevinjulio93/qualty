const getFormData = (form: any) => {
  const data: any = {};
  new FormData(form).forEach((value, key) => (data[key] = value));
  return data;
};

export default getFormData;
