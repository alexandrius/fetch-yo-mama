import { useEffect, useState, useContext, useMemo, useRef } from 'react';

import * as methods from './fetch';
import FetchContext from './fetch-context';

export default function useFetch({
   endpoint,
   method,
   fetchAlias = 'default',
   loadOnMount,
   requestOptions,
}) {
   const aliases = useContext(FetchContext);
   const { baseUrl, headers, bodyType = 'json' } = useMemo(() => aliases[fetchAlias], []);
   const abortControllerRef = useRef(null);

   const [requestState, setRequestState] = useState({
      error: null,
      response: null,
      loading: loadOnMount,
   });

   const request = () => {
      // eslint-disable-next-line no-undef
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      methods[method]({
         url: `${baseUrl}${endpoint}`,
         signal,
         ...requestOptions,
         bodyType: requestOptions.bodyType || bodyType,
         headers: Object.assign({}, headers, requestOptions.headers),
      })
         .then((response) => {
            setRequestState({ response, loading: false, error: null });
         })
         .catch((error) => setRequestState({ response: null, loading: false, error }));
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

function useAny(endpoint, { fetchAlias, loadOnMount, ...requestOptions } = {}, method) {
   return useFetch({ endpoint, fetchAlias, loadOnMount, requestOptions, method });
}

export function useGet(endpoint, params) {
   return useAny(endpoint, { ...params, loadOnMount: true }, 'get');
}

export function usePost(endpoint, params) {
   return useAny(endpoint, params, 'post');
}

export function usePut(endpoint, params) {
   return useAny(endpoint, params, 'put');
}

export function usePatch(endpoint, params) {
   return useAny(endpoint, params, 'patch');
}

export function useDelete(endpoint, params) {
   return useAny(endpoint, params, 'del');
}
