import { CognitoUserPool, ICognitoUserPoolData } from 'amazon-cognito-identity-js';
import getConfig from '../browser/getConfig';

const config = getConfig()

const poolData: ICognitoUserPoolData = {
  UserPoolId: config.app.USER_POOL_ID!,
  ClientId: config.app.CLIENT_ID!,
};

console.log(poolData)

export default new CognitoUserPool(poolData);