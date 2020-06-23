#!/usr/bin/env bash

cd netlify/lambdas || exit 1
find . ! -name "*.zip" -delete
cd - || exit 1
