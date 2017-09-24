# donejs-survey-ad

[![Build Status](https://travis-ci.org/donejs/survey-ad.svg?branch=master)](https://travis-ci.org/donejs/survey-ad)

Control that advertises the DoneJS survey across CanJS.com, StealJS.com, etc.

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'donejs-survey-ad';
```

### CommonJS use

Use `require` to load `donejs-survey-ad` and everything else
needed to create a template that uses `donejs-survey-ad`:

```js
var plugin = require("donejs-survey-ad");
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/donejs-survey-ad/dist/global/donejs-survey-ad.js'></script>
```
