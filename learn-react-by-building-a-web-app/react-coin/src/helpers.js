/**
 * Fetch error helper - by default .fetch does not go into error handling, 
 * so we need this function to handle non ok responses.
 * @param {*} response 
 */

export const handleResponse = (response) => {
    return response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
    });
}