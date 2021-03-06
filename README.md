# Sympozer front-end app V2

Sympozer is a full client side mashup Web application that allows browsing and enriching conference data. Learn more about Sympozer at http://sympozer.liris.cnrs.fr/ .

In 2017, the app architecture has been completely refactored:

  * The conference dataset now follows the <a href="http://www.scholarlydata.org/">ScholarlyData</a> ontology and has been issued using <a href="https://github.com/anuzzolese/cLODg2">cLODg</a> (conference Linked Open Data generator) V2.
  * Its core engine is based on RDF data (instead of JSON), internally served using the <a href="https://github.com/linkeddata/rdflib.js/">rdflib.js</a> library and queried in SPARQL.
  * It fully runs on the client side, and relies on the <a href="https://v4.angular.io/">Angular **v. 4**</a> JavaScript framework, using Web components and other advances. The design layer uses <a href="https://material.angular.io/">Angular Material</a>.
  * Users can create their account, enrich their personal information and participate in the votes
<!--  * Admins can get usage stats through the Piwik system -->

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.6.6.

## Getting started

Install Git & Npm

then run :

1. `git clone https://github.com/sympozer/sympozer-client-seed-v2 `

2. `npm install -g typescript protractor @angular/cli`

3. `cd sympozer-client-seed-v2/app`

4. `npm install`

5. **Do the [Hack broken dependency](#hack-broken-dependency) stuff described below**

6. `ng serve --aot`

### Hack broken dependency

There is a missing dependency in the XMLHttpRequest module, which is itself a dependency of other modules. To solve that, browse to `node_modules/xmlhttprequest/lib/XMLHttpRequest.js` and comment the following lines:

`Line 15- var spawn = require("child_process").spawn; `

`Line 503- var syncProc = spawn(process.argv[0], ["-e", execString]);`

`Line 509- syncProc.stdin.end();`

## Development server

Run `ng serve --aot` for a dev server. Navigate to `http://localhost:4200/`. The app will reload automatically if you change any of the source files.

## Build

Run `ng build` to build the project and deploy on a static server. The build artifacts will be stored in the `app/dist/` directory.

Use the `-prod` option for a production build and `-bh` to set up the base hash that will be included in the index.html file (see examples in `app/package.json` file).

In case you define commands in `app/package.json`, run them using `npm run <commandName>`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get some more help on the `angular-cli` use `ng --help` or check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
