# Hacker Blocks

Online coding platform by Coding Blocks.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd hack`
* `npm install`
* `bower install`

## Running / Development

* The app is configured to use `dev-api.cb.lk` as backend out of the box. You can change this in `config/environment.js`.
* If you wish to code without an instance of hack-backend running, you can
  enable mirage by exporting `HACK_FRONTEND_MIRAGE_ENABLED` in your environment.
* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
