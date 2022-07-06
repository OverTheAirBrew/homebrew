const path = require('path');

const BRANCH = process.env.CIRCLE_BRANCH;

let DOCKER_TAGS = ['{{version}}'];

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
      '@overtheairbrew/semantic-release-docker',
      {
        dockerTags: DOCKER_TAGS,
        dockerImage: 'homebrew',
        dockerCwd: dockerFileLocation,
        dockerFile: 'Dockerfile',
        dockerProject: 'overtheairbrew',
        dockerArgs: {
          APP: 'homebrew',
        },
        login: false,
        build_system: 'buildx',
        platforms: ['linux/arm/v7'],
      },
    ],
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
