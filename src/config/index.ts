const config = {
  local: {
    JWT_PRIVATE_KEY: '992697AFFB446FE665D556D5DEE131DE726ABD7D1D2D8BA2D1A17B0051D1D66B',
    user: 'mattcasey',
  },
  development: {
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
  },
  production: {
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
  },
}

export default config[process.env.NODE_ENV || 'development']
