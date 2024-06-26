import { useEffect, useState, useContext, useMemo, useRef, useCallback } from 'react';

import methods, { type FetchResponse } from './fetch';
import FetchContext from './fetch-context';

interface UseFetchOptions {
   alias?: string;
   loadOnMount?: boolean;
   bodyType?: string;
   headers?: any;
   body?: any;
   params?: any;
}

interface FetchParams extends UseFetchOptions {
   endpoint: string;
   method: string;
}

export interface FetchState<T> {
   error: any;
   response?: T;
   rawResponse?: Response;
   loading: boolean;
}

export default function useFetch<T>({
   endpoint,
   method,
   alias = 'default',
   loadOnMount = false,
   bodyType: bodyTypeParam,
   headers: headersParam,
   body,
   params,
}: FetchParams): [
   FetchState<T>,
   () => void,
   React.MutableRefObject<AbortController | undefined>,
   () => void
] {
   const aliases = useContext(FetchContext);
   const {
      baseUrl,
      headers,
      bodyType = bodyTypeParam || 'json',
   } = useMemo(() => aliases[alias], [aliases[alias]]);
   const abortControllerRef = useRef<AbortController>();

   const [requestState, setRequestState] = useState<FetchState<T>>({
      error: null,
      loading: loadOnMount,
   });

   const request = () => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      setRequestState({ ...requestState, loading: true });

      methods[method]!<T>({
         url: `${baseUrl}${endpoint}`,
         signal,
         bodyType,
         headers: Object.assign({}, headers, headersParam),
         body,
         params,
      })
         .then((response: FetchResponse<T>) => {
            setRequestState({
               response: response.data,
               rawResponse: response.rawResponse,
               loading: false,
               error: null,
            });
         })
         .catch((error: Error) => setRequestState({ response: undefined, loading: false, error }));
   };

   useEffect(() => {
      if (loadOnMount) {
         request();
      }

      return () => {
         abortControllerRef.current?.abort();
      };
   }, []);

   const clearState = useCallback(() => {
      setRequestState({
         error: null,
         loading: false,
         response: undefined,
         rawResponse: undefined,
      });
   }, []);

   return [requestState, request, abortControllerRef, clearState];
}

function useAny<T>({
   endpoint,
   options = {},
   method,
}: {
   endpoint: string;
   options?: UseFetchOptions;
   method: string;
}) {
   if (options.loadOnMount === undefined) {
      options.loadOnMount = method === 'get';
   }

   return useFetch<T>({ endpoint, ...options, method });
}

export function useGet<T>(endpoint: string, options?: UseFetchOptions) {
   return useAny<T>({ endpoint, options, method: 'get' });
}

export function usePost<T>(endpoint: string, options?: UseFetchOptions) {
   return useAny<T>({ endpoint, options, method: 'post' });
}

export function usePut<T>(endpoint: string, options?: UseFetchOptions) {
   return useAny<T>({ endpoint, options, method: 'put' });
}

export function usePatch<T>(endpoint: string, options?: UseFetchOptions) {
   return useAny<T>({ endpoint, options, method: 'patch' });
}

export function useDelete<T>(endpoint: string, options?: UseFetchOptions) {
   return useAny<T>({ endpoint, options, method: 'del' });
}
