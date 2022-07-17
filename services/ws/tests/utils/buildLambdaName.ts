import { STAGE } from '@svc/lib/config';

export const buildLambdaName = (name: string) => `${process.env.SERVICE_NAME}-${STAGE}-${name}`;
