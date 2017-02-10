import config from '../config';

export const local = {
  client: 'postgresql',
  connection: {
    database: 'actonthis',
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'migrations'
  },
};

export const development = {
  client: 'postgresql',
  connection: `postgres://${config.user}:${config.password}@${config.host}/actonthis?sslmode=verify-full&sslrootcert=config/rds-combined-ca-bundle.pem`,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'migrations'
  },
};

export const production = {
  client: 'postgresql',
  connection: `postgres://${config.user}:${config.password}@${config.host}/actonthis?sslmode=verify-full&sslrootcert=config/rds-combined-ca-bundle.pem`,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'migrations'
  },
};
