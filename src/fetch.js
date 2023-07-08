function handleResponse(response) {
   return response.text().then((text) => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
         const error = (data && data.error) || response.statusText;
         return Promise.reject(error);
      }

      return data;
   });
}

function handleError(error) {
   return Promise.reject(error);
}

function _fetch(url, requestOptions) {
   return fetch(url, requestOptions).then(handleResponse).catch(handleError);
}

function getEndpointWithParams(endpoint, params) {
   let endpointWithParams = endpoint;
   if (params) {
      // eslint-disable-next-line no-undef
      const urlSearchParams = new URLSearchParams(params);
      endpointWithParams += `?${urlSearchParams.toString()}`;
   }

   return endpointWithParams;
}

function get({ url, params, ...options }) {
   const requestOptions = {
      method: 'GET',
      ...options,
   };
   return _fetch(getEndpointWithParams(url, params), requestOptions);
}

function post({ url, params, body, ...options }) {
   const requestOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
   };
   return _fetch(getEndpointWithParams(url, params), requestOptions);
}

function patch({ url, params, body, ...options }) {
   const requestOptions = {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
   };
   return _fetch(getEndpointWithParams(url, params), requestOptions);
}

function put({ url, params, body, ...options }) {
   const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
   };
   return _fetch(getEndpointWithParams(url, params), requestOptions);
}

function del({ url, params, ...options }) {
   const requestOptions = {
      method: 'DELETE',
      ...options,
   };
   return _fetch(getEndpointWithParams(url, params), requestOptions);
}

export { get, post, put, patch, del };
