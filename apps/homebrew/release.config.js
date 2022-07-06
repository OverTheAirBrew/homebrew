const BRANCH = process.env.CIRCLE_BRANCH;

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
      '@overtheairbrew/semantic-release-docker-buildx',
      {
        name: 'overtheairbrew/homebrew',
        buildArgs: {
          APP: 'homebrew',
        },
        platforms: ['linux/arm/v7'],
        dockerFile: '../../Dockerfile',
      },
    ],
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
