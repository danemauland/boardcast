import { useContext } from 'react';
import { Config } from '../../types';
import ConfigContext from './ConfigContext';

export default function useConfig(): Config {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('config context not found!');
  }
  return config;
}
