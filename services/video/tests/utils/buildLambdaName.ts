import { STAGE } from '@svc/lib/config';

export const buildLambdaName = (name: string) => {
  return `${process.env.SERVICE_NAME}-${STAGE}-${name}`;
};