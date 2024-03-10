interface FetchOptions extends RequestInit {
   url: string;
   params?: Record<string, string>;
   body?: any;
   bodyType?: string;
}

export type Params = Record<string, any>;

function handleResponse(response: Response) {
   return response.text().then((text) => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
         const error = data || response.statusText;
         return Promise.reject(error);
      }

      return data;
   });
}

function handleError(error: any) {
   return Promise.reject(error);
}

function _fetch(url: string, requestOptions: RequestInit): Promise<Params> {
   return fetch(url, requestOptions).then(handleResponse).catch(handleError);
}

function getEndpointWithParams(endpoint: string, params?: Record<string, string>) {
   let endpointWithParams = endpoint;
   if (params) {
      const urlSearchParams = new URLSearchParams(params);
      endpointWithParams += `?${urlSearchParams.toString()}`;
   }

   return endpointWithParams;
}

function convertToFormData(body: any) {
   const formData = new FormData();

   for (const key in body) {
      formData.append(key, body[key]);
   }
}

function any(
   { url, params, body: _body, bodyType, ...options }: FetchOptions,
   method: string
): Promise<any> {
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

export function get(options: FetchOptions): Promise<any> {
   return any(options, 'GET');
}

export function post(options: FetchOptions): Promise<any> {
   return any(options, 'POST');
}

export function patch(options: FetchOptions): Promise<any> {
   return any(options, 'PATCH');
}

export function put(options: FetchOptions): Promise<any> {
   return any(options, 'PUT');
}

export function del(options: FetchOptions): Promise<any> {
   return any(options, 'DELETE');
}
