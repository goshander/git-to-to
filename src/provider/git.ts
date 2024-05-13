import * as fs from 'fs'

import type { GitCredentials, PullProvider, PutProvider } from '../types'

const Provider: PutProvider & PullProvider = {
  async put(dir, destination, auth) {
    const {push} = await import('isomorphic-git')
    const http = await import('isomorphic-git/http/node/index.js')

    await push({
      fs,
      http,
      dir,
      url: destination,
      onAuth: () => {
        const authCredentials = auth() as GitCredentials

        return authCredentials
      },
      force: true,
    })
  },
  async pull(dir, source, auth) {
    const {clone} = await import('isomorphic-git')
    const http = await import('isomorphic-git/http/node/index.js')

    await clone({
      fs,
      http,
      dir,
      url: source,
      onAuth: () => {
        const authCredentials = auth() as GitCredentials

        return authCredentials
      },
    })
  },
}

export const GitProvider = Provider
