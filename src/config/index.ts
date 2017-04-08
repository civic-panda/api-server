type Config = {
  jwtSecret: string;
  user: string;
  host: string;
  port: string;
  password: string;
  dbUrl: string;
}

const local: Config = {
  jwtSecret: '992697AFFB446FE665D556D5DEE131DE726ABD7D1D2D8BA2D1A17B0051D1D66B',
  user: 'postgres',
  host: undefined,
  port: undefined,
  password: undefined,
  dbUrl: undefined,
}

const development: Config = {
  jwtSecret: process.env.JWT_PRIVATE_KEY,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  dbUrl: process.env.DATABASE_URL,
}

const production: Config = {
  jwtSecret: process.env.JWT_PRIVATE_KEY,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  dbUrl: process.env.DATABASE_URL,
}

const config = (() => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;
    case 'local':
      return local;
    case 'development':
    default:
      return development;
  }
})();

export default config;
