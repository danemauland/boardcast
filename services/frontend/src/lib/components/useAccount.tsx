import { useContext } from 'react';
import { AccountContext } from './Account';

export default function useAccount(): AccountContext {
  const account = useContext(AccountContext);
  if (!account) {
    throw new Error('config context not found!');
  }
  return account;
}
