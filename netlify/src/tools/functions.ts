import { APIGatewayProxyEventHeaders } from 'aws-lambda';

require('dotenv').config();
const fs = require('fs');
const dotenv = require('dotenv');

const getTokenFromHeaders = (headers: APIGatewayProxyEventHeaders): string|null => {
  if (headers.authorization === undefined) {
    return null;
  }
  return headers.authorization.split(' ')[1];
};

const loadEnv = (): void => {
  if (fs.existsSync('.env')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
      if (envConfig[k]) {
        process.env[k] = envConfig[k];
      }
    }
  }
};

export { getTokenFromHeaders, loadEnv };
