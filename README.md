# use-fetch

useFetch hook for React

![logo](https://github.com/alexandrius/use-fetch/assets/5978212/feb261d6-d2fd-418f-9637-5923ca2ad97e)

## Usage

### Step 1

Wrap the app with FetchProvider and pass `aliases`.

```jsx
import { FetchProvider } from 'react-use-fetch';

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
            },
         }}>
         <Root />
      </FetchProvider>
   );
}
```

### Step 2

Use the hook:

```jsx
import { useGet } from 'react-use-fetch';

export default function UserList() {
   const { error, response: users, request, loading } = useGet('/users');

   if (loading) return <p>Loading...</p>;
   if (error) return <p>Error Loading Data</p>;
   return (
      <>
         {users.map((u) => (
            <p>{u.name}</p>
         ))}
      </>
   );
}
```

### Customize request

```js
const { error, response, request, loading } = useGet('/custom', {
   fetchAlias: 'custom',
   params: {},
   headers: {},
});
```

### Other methods

```js
import { usePost, useDelete, usePatch, usePut } from 'react-use-fetch';

export default function Component() {
   // fetch params
   const fetchParams = {
      body: {},
      params: {},
      headers: {},
   };
   const { error, response, request, loading } = usePost('/user', {
      ...fetchParams,
   });
}
```
