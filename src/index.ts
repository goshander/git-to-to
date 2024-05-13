import { join } from 'node:path'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'

import { configDotenv } from 'dotenv'
import { pino } from 'pino'

import { provider } from './provider'
import { GitToToOptions, MirrorOptions } from './types'

export { PROVIDER } from './types'

const mirror = async (options: MirrorOptions) => {
  const { repo, auth, log } = options

  log.info({ msg: 'start mirror', repo: repo.slug })

  const dir = join(options.dir, repo.slug)

  if (existsSync(dir)) {
    rmSync(dir, { recursive: true })
  }
  mkdirSync(dir)

  await provider.git.pull(dir, repo.from.source, repo.from.auth ? auth[repo.from.auth] : () => {})

  if (Array.isArray(repo.to)) {
    for (let i = 0; i < repo.to.length; i += 1) {
      const provKey = repo.to[i].provider || 'git'

      log.info({ msg: 'copy mirror step', repo: repo.slug, to: provKey, auth: repo.to[i].auth })

      try {
        const prov = provider[provKey]
        const authTo = repo.to[i].auth ? auth[repo.to[i].auth] : () => {}

        await prov.put(dir, repo.to[i].destination, authTo)
      } catch (error) {
        const err = error as Error

        log.error({ msg: 'error copy mirror', to: provKey, auth: repo.to[i].auth, error: err.stack || err })
      }
    }
  } else {
    log.info({ msg: 'copy mirror', repo: repo.slug, to: repo.to.provider })

    const prov = provider[repo.to.provider || 'git']
    const authTo = repo.to.auth ? auth[repo.to.auth] : () => {}

    await prov.put(dir, repo.to.destination, authTo)
  }

  if (existsSync(dir)) {
    rmSync(dir, { recursive: true })
  }

  log.info({ msg: 'success mirror', repo: repo.slug })
}

export const gitToTo = async (options: GitToToOptions) => {
  const log = pino()

  log.info({ msg: 'start git to to process...' })

  configDotenv()

  const dir = join(tmpdir(), 'git-to-to')

  if (existsSync(dir)) {
    rmSync(dir, { recursive: true })
  }
  mkdirSync(dir)

  const auth = options.auth

  const repos = Object.values(options.repos)

  for (let i = 0; i < repos.length; i += 1) {
    try {
      await mirror({
        repo: repos[i],
        dir,
        auth,
        log,
      })
    } catch (error) {
      const err = error as Error

      log.error({ msg: 'error mirror', repo: repos[i].slug, error: err.stack || err })
    }
  }
}
