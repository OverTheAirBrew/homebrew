const path = require('path');
import { readFileSync, writeFileSync } from 'fs';
import { i18nextToPo } from 'i18next-conv';
import * as jsonConcat from 'json-concat';

jsonConcat(
  {
    src: path.join(__dirname, '../dist/locales'),
    dest: path.join(__dirname, '../.temp-translation-files/result.json'),
  },
  function (err, json) {
    if (!err) {
      const source = path.join(
        __dirname,
        '../.temp-translation-files/result.json',
      );
      const options = { keyasareference: true };

      function save(target) {
        return (result) => {
          writeFileSync(target, result);
        };
      }

      i18nextToPo('en-gb', readFileSync(source), options).then(
        save(
          path.join(__dirname, '../.temp-translation-files/translation.pot'),
        ),
      );
    }
  },
);
