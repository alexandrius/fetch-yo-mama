import { useEffect, useState, useContext, useMemo, useRef } from 'react';

import { get, post, put, patch, del, JsonResponse } from './fetch';
import FetchContext from './fetch-context';

const methods = { get, post, put, patch, del };

interface RequestOptions {
   bodyType?: string;
   headers?: any;
}

interface FetchParams {
   endpoint: string;
   method: string;
   fetchAlias: string;
   loadOnMount: boolean;
   requestOptions: RequestOptions;
}

interface FetchState {
   error: any;
   response: any;
   loading: boolean;
}

interface UseFetchReturn extends FetchState {
   request: () => void;
   abortControllerRef: React.MutableRefObject<AbortController | null>;
}

export default function useFetch({
   endpoint,
   method,
   fetchAlias,
   loadOnMount,
   requestOptions,
}: FetchParams): UseFetchReturn {
   const aliases = useContext(FetchContext);
   const { baseUrl, headers, bodyType = 'json' } = useMemo(() => aliases[fetchAlias], []);
   const abortControllerRef = useRef<AbortController | null>(null);

   const [requestState, setRequestState] = useState<FetchState>({
      error: null,
      response: null,
      loading: loadOnMount,
   });

   const request = () => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      // @ts-ignore
      methods[method]({
         url: `${baseUrl}${endpoint}`,
         signal,
         ...requestOptions,
         bodyType: requestOptions.bodyType || bodyType,
         headers: Object.assign({}, headers, requestOptions.headers),
      })
         .then((response: JsonResponse) => {
            setRequestState({ response, loading: false, error: null });
         })
         .catch((error: Error) => setRequestState({ response: null, loading: false, error }));
   };

   useEffect(() => {
      if (loadOnMount) {
         request();
      }

      return () => {
         abortControllerRef.current?.abort();
      };
   }, []);

   return { ...requestState, request, abortControllerRef };
}

function useAny(
   endpoint: string,
   { fetchAlias = 'default', loadOnMount = false, ...requestOptions } = {},
   method: string
) {
   return useFetch({ endpoint, fetchAlias, loadOnMount, requestOptions, method });
}

export function useGet(endpoint: string, params: any) {
   return useAny(endpoint, { ...params, loadOnMount: true }, 'get');
}

export function usePost(endpoint: string, params: any) {
   return useAny(endpoint, params, 'post');
}

export function usePut(endpoint: string, params: any) {
   return useAny(endpoint, params, 'put');
}

export function usePatch(endpoint: string, params: any) {
   return useAny(endpoint, params, 'patch');
}

export function useDelete(endpoint: string, params: any) {
   return useAny(endpoint, params, 'del');
}
