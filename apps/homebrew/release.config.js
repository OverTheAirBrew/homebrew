const path = require('path');

const BRANCH = process.env.CIRCLE_BRANCH;

let DOCKER_TAGS = ['{{major}}.{{minor}}.{{patch}}'];

if (BRANCH === 'main') {
  DOCKER_TAGS.push('latest');
} else if (BRANCH === 'next') {
  DOCKER_TAGS.push('next');
}

const dockerFileLocation = path.join(process.cwd(), '..', '..');

module.exports = {
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
        dockerImage: 'homebrew',
        dockerProject: 'overtheairbrew',

        login: false,

        platforms: ['linux/arm64', 'linux/arm/v7', 'linux/amd64'],
        buildArgs: {
          APP: 'homebrew',
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
