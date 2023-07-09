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

function convertToFormData(body) {
   const formData = new FormData();

   for (const key in formData) {
      formData.append(key, body[key]);
   }
}

function any({ url, params, body: _body, bodyType, ...options }, method) {
   let body = _body;
   if (bodyType === 'json') {
      body = JSON.stringify(body);
   } else if (bodyType === 'formdata') {
      body = convertToFormData(body);
   }

   const requestOptions = {
      method,
      body,
      ...options,
   };
   return _fetch(getEndpointWithParams(url, params), requestOptions);
}

function get(options) {
   return any(options, 'GET');
}

function post(options) {
   return any(options, 'POST');
}

function patch(options) {
   return any(options, 'PATCH');
}

function put(options) {
   return any(options, 'PUT');
}

function del(options) {
   return any(options, 'DELETE');
}

export { get, post, put, patch, del };
