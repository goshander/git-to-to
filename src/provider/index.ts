import { GitProvider } from './git'
import { S3Provider } from './s3'
import { YaDiskProvider } from './ya_disk'

export const provider = {
  git: GitProvider,
  s3: S3Provider,
  ya_disk: YaDiskProvider,
}
