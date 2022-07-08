import './load-test-env';
import 'aws-testing-library/lib/jest';
import dotenv from 'dotenv';
import path from 'path';

jest.setTimeout(120000)

const dir = `../../config/${process.env.STAGE === 'dev' ? 'local' : 'remote'}Integration.env`;

// Load custom-defined config values into process.env for purposes of running integration & E2E tests
dotenv.config({
  path: path.resolve(__dirname, dir),
});