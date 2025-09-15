declare module '*.svg'
declare module 'jsonwebtoken'

declare namespace NodeJS {
  interface Global {
    jest?: any
  }
}

declare const describe: any
declare const it: any
declare const expect: any
declare const beforeEach: any
declare const afterEach: any
