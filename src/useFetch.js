import { useCallback, useEffect, useState, useContext, useMemo, useRef } from 'react';

import * as methods from './fetch';
import FetchContext from './fetch-context';

export default function useFetch({
   endpoint,
   method,
   fetchAlias = 'default',
   requestOnMount = true,
   requestOptions,
}) {
   const aliases = useContext(FetchContext);
   const { baseUrl, headers } = useMemo(() => aliases[fetchAlias], []);
   const abortController = useRef(null);
   const [requestState, setRequestState] = useState({
      error: null,
      response: null,
      request,
      loading: requestOnMount,
   });

   const request = useCallback(() => {
      // eslint-disable-next-line no-undef
      abortController.current = new AbortController();
      const { signal } = abortController.current;
      methods[method]({
         url: `${baseUrl}${endpoint}`,
         signal,
         ...requestOptions,
         headers: Object.assign({}, headers, requestOptions.headers),
      })
         .then((response) => {
            setRequestState((requestState) => ({ ...requestState, loading: false, response }));
         })
         .catch((error) =>
            setRequestState((requestState) => ({ ...requestState, loading: false, error }))
         );
   }, []);

   useEffect(() => {
      if (requestOnMount) {
         request();
      }

      return () => {
         abortController.current.abort();
      };
   }, []);

   return requestState;
}

export function useGet(endpoint, { fetchAlias, requestOnMount, ...requestOptions } = {}) {
   return useFetch({ endpoint, requestOptions, requestOnMount, fetchAlias, method: 'get' });
}

export function usePost(endpoint, { fetchAlias, requestOnMount, ...requestOptions } = {}) {
   return useFetch({ endpoint, requestOptions, requestOnMount, fetchAlias, method: 'post' });
}

export function usePut(endpoint, { fetchAlias, requestOnMount, ...requestOptions } = {}) {
   return useFetch({ endpoint, requestOptions, requestOnMount, fetchAlias, method: 'put' });
}

export function useDelete(endpoint, { fetchAlias, requestOnMount, ...requestOptions } = {}) {
   return useFetch({ endpoint, requestOptions, requestOnMount, fetchAlias, method: 'del' });
}
