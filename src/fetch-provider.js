import FetchContext from './fetch-context';

export default function FetchProvider({ aliases, children }) {
   return <FetchContext.Provider value={aliases}>{children}</FetchContext.Provider>;
}
