export const isTest = () => {
  return process.env.NODE_ENV === 'test';
};

export const isDev = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProd = () => {
  return process.env.NODE_ENV === 'production';
};

export const getEnvFilePath = () => {
  const environment: string = process.env.NODE_ENV || 'development';
  if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV is not set (needed to choose the .env file)');
  }
  const file = `.env.${environment}`;
  return file;
};
