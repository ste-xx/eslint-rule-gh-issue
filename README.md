# eslint-plugin-gh-issue

Triggers if a github issue is closed

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



