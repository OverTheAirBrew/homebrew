const BRANCH = process.env.CIRCLE_BRANCH;

module.exports = {
  branches: [
    'master',
    {
      name: 'next',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    BRANCH === 'next'
      ? [
          '@codedependant/semantic-release-docker',
          {
            dockerTags: ['latest'],
            dockerImage: 'homebrew-testing',
            dockerFile: 'Dockerfile',
            dockerRegistry: 'ghcr.io',
          },
        ]
      : undefined,
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
