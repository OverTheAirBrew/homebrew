#!/bin/bash
set -e

if [ -d .temp-translation-files ]; then
  rm -rf .temp-translation-files
fi

mkdir .temp-translation-files

node dist/scripts/generate-pot-files

# crowdin upload sources