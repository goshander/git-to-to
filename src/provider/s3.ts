import { createReadStream, createWriteStream, existsSync, rmSync } from 'fs'
import { basename, join } from 'path'

import { default as archiver } from 'archiver'
import * as Minio from 'minio'
import axios from 'axios'

import type { PutProvider, S3Credentials } from '../types'

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

    const authCredentials = auth() as S3Credentials

    const minioClient = new Minio.Client({
      endPoint: authCredentials.endpoint,
      port: authCredentials.port || 443,
      useSSL: authCredentials.useSSL !== undefined ? authCredentials.useSSL : true,
      accessKey: authCredentials.accessKey || '',
      secretKey: authCredentials.secretKey || '',
    })

    const exists = await minioClient.bucketExists(authCredentials.bucket)
    if (!exists) {
      await minioClient.makeBucket(authCredentials.bucket)
    }

    const link = await minioClient.presignedPutObject(authCredentials.bucket, `${destination}.zip`, 600)

    const f = createReadStream(archiveFile)

    try {
      await axios.put(link, f)
    } finally {
      f.close()
    }

    if (existsSync(archiveFile)) {
      rmSync(archiveFile)
    }
  },
}

export const S3Provider = Provider
