import * as fs from 'fs'

import { clone, push } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'

import type { GitCredentials, PullProvider, PutProvider } from '../types'

const Provider: PutProvider & PullProvider = {
  async put(dir, destination, auth) {
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
