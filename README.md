# git-to-to

Git repositories auto backup utility

### Install

`npm install git-to-to`

### Usage

```js
import {gitToTo, PROVIDER} from 'git-to-to';

await gitToTo({
  repos: {
    test: {
      slug: 'test',
      from: {
        auth: 'github',
        source: 'https://github.com/test/test.git',
      },
      to: [
        {
          auth: 'gitlab',
          destination: 'https://gitlab.com/test/test.git',
        },
        {
          auth: 'yc',
          destination: 'backup/test',
          provider: PROVIDER.S3,
        },
      ],
    },
  },
  auth: {
    github: () => {
      return {
        username: process.env.GITHUB_USERNAME,
        password: process.env.GITHUB_PASSWORD,
      }
    },
    gitlab: () => {
      return {
        username: process.env.GITLAB_USERNAME,
        password: process.env.GITLAB_PASSWORD,
      }
    },
    s3: () => {
      return {
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY,
        endpoint: 'storage.s3.net',
        bucket: 'test-bucket',
      }
    },
  },
});
```