import { createContext } from 'react';
import { Config } from '../../types';

const ConfigContext = createContext<Config | undefined>(undefined);

export default ConfigContext;
