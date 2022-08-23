#!/bin/bash

set -e

echo
echo "█▀▀ █  █   █▀▀ █▀▀█ █  █ █▀▀▄ ▀▀█▀▀ █▀▀ █▀▀█"
echo "█▀  █  █   █   █  █ █  █ █  █   █   █▀  █▄▄▀"
echo "▀    ▀▀▀   ▀▀▀ ▀▀▀▀  ▀▀▀ ▀  ▀   ▀   ▀▀▀ ▀ ▀▀"
echo "           Function usage counter"
echo
echo "█████████████████████████"
echo "█     Linting code      █"
echo "█████████████████████████"
npm run lint

echo
echo "█████████████████████████"
echo "█     Running tests     █"
echo "█████████████████████████"
npx c8 --check-coverage --lines 100 npm run testcjs
npm run testmjs

echo
echo "█████████████████████████"
echo "█   Linting markdown    █"
echo "█████████████████████████"
npm run lint-markdown

echo "bye."
