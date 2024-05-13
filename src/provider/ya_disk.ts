import { createReadStream, createWriteStream, existsSync, rmSync } from 'fs'
import { basename, join } from 'path'

import { default as archiver } from 'archiver'
import axios from 'axios'

import type { PutProvider, YaDiskCredentials } from '../types'

const Provider: PutProvider = {
  async put(dir, destination, auth) {
    const archiveFile = join(dir, '..', `${basename(destination)}.zip`)

    if (existsSync(archiveFile)) {
      rmSync(archiveFile)
    }

    const archiveStream = createWriteStream(archiveFile)
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })

    archive.pipe(archiveStream)

    archive.directory(dir, false)

    await archive.finalize()

    const authCredentials = auth() as YaDiskCredentials

    const yaDiskUrl = 'https://cloud-api.yandex.net/v1/disk'

    const {
      data: { href },
    } = await axios.get(`/resources/upload?path=${encodeURIComponent(`${destination}.zip`)}`, {
      baseURL: yaDiskUrl,
      headers: {
        Authorization: `OAuth ${authCredentials.token}`,
      },
    })

    const f = createReadStream(archiveFile)

    try {
      await axios.put(href, f)
    } finally {
      f.close()
    }

    if (existsSync(archiveFile)) {
      rmSync(archiveFile)
    }
  },
}

export const YaDiskProvider = Provider
