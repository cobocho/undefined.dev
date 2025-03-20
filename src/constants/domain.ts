export const DOMAIN =
  process.env.NODE_ENV === 'production' ? 'undefined.dev' : 'localhost:3000'

export const HOST =
  process.env.NODE_ENV === 'production'
    ? 'https://un-defined.dev'
    : 'http://localhost:3000'
