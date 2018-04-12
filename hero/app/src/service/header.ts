export const getAuthorization = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('id_token')
});
