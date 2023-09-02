import { useEffect, useState, useContext, useMemo, useRef } from 'react';

import { get, post, put, patch, del } from './fetch';
import FetchContext from './fetch-context';

const methods = { get, post, put, patch, del };

interface FetchOptions {
   alias?: string;
   loadOnMount?: boolean;
   bodyType?: string;
   headers?: any;
   body?: any;
   params?: any;
}

interface FetchParams extends FetchOptions {
   endpoint: string;
   method: string;
}

interface FetchState {
   error: any;
   response: any;
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
}: FetchParams): [FetchState, () => void, React.MutableRefObject<AbortController | undefined>] {
   const aliases = useContext(FetchContext);
   const {
      baseUrl,
      headers,
      bodyType = bodyTypeParam || 'json',
   } = useMemo(() => aliases[alias], []);
   const abortControllerRef = useRef<AbortController>();

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
         bodyType,
         headers: Object.assign({}, headers, headersParam),
         body,
         params,
      })
         .then((response: T) => {
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

   return [requestState, request, abortControllerRef];
}

function useAny({
   endpoint,
   options = {},
   method,
}: {
   endpoint: string;
   options?: FetchOptions;
   method: string;
}) {
   if (options.loadOnMount === undefined) {
      options.loadOnMount = method === 'get';
   }

   return useFetch({ endpoint, ...options, method });
}

export function useGet(endpoint: string, options?: FetchOptions) {
   return useAny({ endpoint, options, method: 'get' });
}

export function usePost(endpoint: string, options?: FetchOptions) {
   return useAny({ endpoint, options, method: 'post' });
}

export function usePut(endpoint: string, options?: FetchOptions) {
   return useAny({ endpoint, options, method: 'put' });
}

export function usePatch(endpoint: string, options?: FetchOptions) {
   return useAny({ endpoint, options, method: 'patch' });
}

export function useDelete(endpoint: string, options?: FetchOptions) {
   return useAny({ endpoint, options, method: 'del' });
}
