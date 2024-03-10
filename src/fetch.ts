interface FetchOptions extends RequestInit {
   url: string;
   params?: Record<string, string>;
   body?: any;
   bodyType?: string;
}

export type Params = Record<string, any>;

async function handleResponse(response: Response) {
   const text = await response.text();
   if (response.ok) {
      return JSON.parse(text);
   }
   throw new Error(text || response.statusText);
}

function handleError(error: Error) {
   let jsonError;
   try {
      jsonError = JSON.parse(error.message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (e) {}
   return Promise.reject(jsonError || error.message);
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
