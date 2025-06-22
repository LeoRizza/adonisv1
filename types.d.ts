// Minimal stubs to satisfy TypeScript when node_modules are missing

declare type HttpContext = any;
declare type NextFn = any;
declare type Authenticators = any;
declare type InferAuthenticators<T> = any;
declare type InferAuthEvents<T> = any;
declare type InferHashers<T> = any;
declare type InferLoggers<T> = any;
declare type Config = any;
declare type DateTime = any;
declare const process: any;

// Fallback for any imported module
declare module '@adonisjs/auth/types' {
  export interface Authenticators {}
  export type InferAuthenticators<T> = any;
  export type InferAuthEvents<T> = any;
}

declare module '@adonisjs/core/types' {
  export interface EventsList {}
  export interface HashersList {}
  export interface LoggersList {}
  export type InferHashers<T> = any;
  export type InferLoggers<T> = any;
}

declare module '@adonisjs/*';
declare module '#*';
declare module '@japa/*';
declare module 'luxon';
