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

function _fetch<T>(url: string, requestOptions: RequestInit): Promise<T> {
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

function any<T>(
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
   return _fetch<T>(getEndpointWithParams(url, params), requestOptions);
}

function get<T>(options: FetchOptions): Promise<T> {
   return any(options, 'GET');
}

function post<T>(options: FetchOptions): Promise<T> {
   return any(options, 'POST');
}

function patch<T>(options: FetchOptions): Promise<T> {
   return any(options, 'PATCH');
}

function put<T>(options: FetchOptions): Promise<T> {
   return any(options, 'PUT');
}

function del<T>(options: FetchOptions): Promise<T> {
   return any(options, 'DELETE');
}

const methods: Record<string, <T>(options: FetchOptions) => Promise<T>> = {
   get,
   post,
   put,
   patch,
   del,
};

export default methods;
