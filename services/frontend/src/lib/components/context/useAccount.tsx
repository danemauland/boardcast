import { useContext } from 'react';
import { AccountContext, AccountContextInterface } from './Account';

export default function useAccount(): AccountContextInterface {
  const account = useContext(AccountContext);
  if (!account) {
    throw new Error('account context not found!');
  }
  return account;
}
