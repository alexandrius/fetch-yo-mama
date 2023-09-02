import type { FC } from 'react';

import FetchContext from './fetch-context';

interface Alias extends RequestInit {
   baseUrl: string;
   headers?: Record<string, string>;
   bodyType?: 'json' | 'formdata' | 'original';
}

interface FetchProviderProps {
   aliases: Record<string, Alias>;
   children: React.ReactNode;
}

const FetchProvider: FC<FetchProviderProps> = ({ aliases, children }) => {
   return <FetchContext.Provider value={aliases}>{children}</FetchContext.Provider>;
};

export default FetchProvider;
