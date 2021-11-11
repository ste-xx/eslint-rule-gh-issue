# eslint-plugin-gh-issue

Triggers if a github issue is closed

I see often code like this:

```javascript
// workaround for https://github.com/vuetifyjs/vuetify/issues/6633

/**
  workaround code for the issue.
**/
```
but even if the issue is fixed, the workaround remains.

To improve the tracking of closed issues and workaround code in the code based I wrote this small eslint plugin.

So when you a have workaround code like the example above, you rewrite it like this:

```javascript
// workaround for gh-issue vuetifyjs/vuetify/issues/6633
/**
  workaround code for the issue.
**/
```

If the issue is closed, eslint will produce a warning and you know that maybe some action can be taken to remove the workaround code.

The plugin itself will not call GitHub api itself. Instead, it will call a cloudflare worker, which requests and caches the issues state.  

Otherwise, I was running in some quota issues by GitHub.


## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-gh-issue`:

```sh
npm install eslint-plugin-gh-issue --save-dev
```

## Usage

Add `gh-issue` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "gh-issue"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "gh-issue/open-issue": 2
    }
}
```

## Supported Rules

Currently, there is only the open issue rule.



