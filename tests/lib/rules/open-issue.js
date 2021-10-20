/**
 * @fileoverview foobar
 * @author stefan breitenstein
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/open-issue"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const notMatching = [
  "// const x = 'abc'",
  "// todo const x = 'abc'"
]
const closedTicket = [
  "// todo gh-issue ste-xx/eslint-rule-gh-issue/issues/1",
  "// TODO gh-issue ste-xx/eslint-rule-gh-issue/issues/1",
  "// TODO GH-ISSUE ste-xx/eslint-rule-gh-issue/issues/1",
  "// todo gh-issue ste-xx/eslint-rule-gh-issue/issues/1 with description",
  `/*
    * TODO gh-issue ste-xx/eslint-rule-gh-issue/issues/1 workaround
    * TODO gh-issue ste-xx/eslint-rule-gh-issue/issues/2 another hotfix
    */
  `
]

ruleTester.run("open-issue", rule, {
  valid: [
    ...notMatching,
    ...closedTicket
  ],

  invalid: [
    {
      code: "// TODO gh-issue ste-xx/eslint-rule-gh-issue/issues/3",
      errors: [{ message: "Issue ste-xx/eslint-rule-gh-issue/issues/3 is closed. ()", type: null }],
    },
    {
      code: "// TODO gh-issue ste-xx/eslint-rule-gh-issue/issues/3 desc text",
      errors: [{ message: "Issue ste-xx/eslint-rule-gh-issue/issues/3 is closed. (desc text)", type: null }],
    },
  ],
});
