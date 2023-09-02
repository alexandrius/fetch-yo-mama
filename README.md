# fetch-yo-mama

<p align="center" style="margin: 0px auto; margin-top: 15px; max-width: 600px">
    <a href="https://npmjs.com/package/fetch-yo-mama"><img src="https://img.shields.io/npm/v/fetch-yo-mama"></a>
    <a href="#"><img src="https://img.shields.io/npm/dt/fetch-yo-mama"/></a>
</p>

Fetch API QoL hooks for React.

> The request will be automatically aborted if the component is unmounted

![logo](https://github.com/alexandrius/fetch-yo-mama/assets/5978212/feb261d6-d2fd-418f-9637-5923ca2ad97e)

## Usage

### Step - 0

> Install the library

`yarn add fetch-yo-mama`

### Step - 1

> Wrap the app with FetchProvider and pass `aliases`.

```jsx
import { FetchProvider } from 'fetch-yo-mama';

import Root from './src/root';

export default function App() {
   return (
      <FetchProvider
         aliases={{
            default: {
               baseUrl: 'https://jsonplaceholder.typicode.com',
               headers: { 'Content-Type': 'application/json' },
            },
            custom: {
               baseUrl: 'https://coolapi.com',
               bodyType: 'formdata', // json|formdata|original. default: json
            },
         }}>
         <Root />
      </FetchProvider>
   );
}
```

### Step - 2

> Use the hook:

```jsx
import { useGet } from 'fetch-yo-mama';

export default function UserList() {
   const [usersRequest, request, abortControllerRef] = useGet('/users');

   if (usersRequest.loading) return <p>Loading...</p>;
   if (usersRequest.error) return <p>Error Loading Data</p>;
   return (
      <>
         {usersRequest.response.map((u) => (
            <p>{u.name}</p>
         ))}
      </>
   );
}
```

### Customize request

```js
const [requestState, request, abortControllerRef] = useGet('/custom', {
   alias: 'custom',
   params: {},
   headers: {},
   loadOnMount: false, // Don't fetch on mount
   ...anyOtherFetchParam,
});
```

### Other methods

```js
import { usePost, useDelete, usePatch, usePut } from 'fetch-yo-mama';

export default function Component() {
   // fetch params
   const fetchParams = {
      body: {},
      params: {},
      headers: {},
      ..anyOtherFetchParam
   };
   const {
      error,
      response,
      request,
      loading,
      abortControllerRef, // abortControllerRef.current.abort() to manually abort the request
   } = usePost('/user', {
      ...fetchParams,
   });
}
```

## TODO:

-  [x] Rewrite to TypeScript
