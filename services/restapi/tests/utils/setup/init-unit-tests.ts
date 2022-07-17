/* eslint import/no-extraneous-dependencies:0 */
import 'aws-testing-library/lib/jest';
import dotenv from 'dotenv';
import path from 'path';
import './load-test-env';

dotenv.config({
  path: path.resolve(__dirname, '../../config/unit.env'),
});
