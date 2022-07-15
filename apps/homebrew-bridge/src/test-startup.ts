Promise.resolve()
  .then(async () => {
    require('./main');
    process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
