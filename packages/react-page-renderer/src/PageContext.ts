import { createContext } from 'react';

import { Utils } from '@/types';

export interface PageContextInterface {
    $Utils: Utils
}

export default createContext<PageContextInterface>({} as PageContextInterface);
