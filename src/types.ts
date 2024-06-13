import type { BaseLogger } from 'pino'

export type GitCredentials = {
  username?: string
  password?: string
  headers?: {
    [key: string]: string
  }
}

export type S3Credentials = {
  accessKey?: string
  secretKey?: string
  endpoint: string
  bucket: string
  port?: number
  useSSL?: boolean
}

export type YaDiskCredentials = {
  token?: string
}

export type Auth = () => GitCredentials | S3Credentials | YaDiskCredentials | void

export type PullProvider = {
  pull: (dir: string, source: string, auth: Auth) => void | Promise<void>
}

export type PutProvider = {
  put: (dir: string, destination: string, auth: Auth) => void | Promise<void>
}

export type FromProvider = 'git'

export const PROVIDER = {
  GIT: 'git',
  S3: 's3',
  YA_DISK: 'ya_disk',
} as const

export type ToProvider = (typeof PROVIDER)[keyof typeof PROVIDER]

export type MirrorRepo = {
  slug: string
  from: {
    provider?: FromProvider
    auth?: string
    source: string
  }
  to:
    | Array<{
        provider?: ToProvider
        auth: string
        destination: string
      }>
    | {
        provider?: ToProvider
        auth: string
        destination: string
      }
}

export type GitToToOptions = {
  repos: {
    [key: string]: MirrorRepo
  }
  auth: {
    [key: string]: Auth
  }
  pool?: number
  parallel?: boolean
}

export type MirrorOptions = {
  repo: MirrorRepo
  dir: string
  auth: {
    [key: string]: Auth
  }
  log: BaseLogger
  parallel?: boolean
}
