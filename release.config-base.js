export function generateReleaseConfig(appName) {
  const BRANCH = process.env.BRANCH;

  let DOCKER_TAGS = ['{{version}}'];

  if (BRANCH === 'main') {
    DOCKER_TAGS.push('latest');
  } else if (BRANCH === 'next') {
    DOCKER_TAGS.push('next');
  }

  const dockerFileLocation = path.join(process.cwd(), '..', '..');

  return {
    branches: [
      'main',
      {
        name: 'next',
        prerelease: true,
      },
    ],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@overtheairbrew/semantic-release-dockerbuildx',
        {
          dockerImage: appName,
          dockerProject: 'overtheairbrew',

          login: false,

          platforms: ['linux/arm64', 'linux/arm/v7', 'linux/amd64'],
          buildArgs: {
            APP: appName,
          },

          tags: DOCKER_TAGS,
          cwd: dockerFileLocation,
        },
      ],
      [
        '@semantic-release/github',
        {
          assets: [
            {
              path: 'overtheairbrew-homebrew-${nextRelease.version}.tgz',
              label: 'homebrew-${nextRelease.version}',
            },
          ],
        },
      ],
      [
        '@semantic-release/npm',
        {
          publish: false,
        },
      ],
      '@semantic-release/git',
    ],
  };
}
