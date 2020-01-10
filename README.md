# AliasGandiAngular

[![CircleCI](https://circleci.com/gh/sylvainmetayer/alias-gandi-angular/tree/master.svg?style=svg&circle-token=92548e3df680d17a912aa5c43d94fcde7dd264cd)](https://circleci.com/gh/sylvainmetayer/alias-gandi-angular/tree/master)
[![Github Action](https://github.com/sylvainmetayer/alias-gandi-angular/workflows/CI/badge.svg)](https://github.com/sylvainmetayer/alias-gandi-angular/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/ed6b3745-ef58-427f-b158-dc27d283436e/deploy-status)](https://app.netlify.com/sites/alias-gandi-angular/deploys)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.22.

## Start (dev)

- `npm run nls` :  This will start the netlify lambda development server for serveless functions.
- `npm start` : This will start the angular development server

Their is a proxy where lambdas are executed at `http://localhost:4200/api/*`. See `proxy.config.json` for details.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
