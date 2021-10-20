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
  "// todo gh-issue ionic-team/capacitor/issues/3110",
  "// TODO gh-issue ionic-team/capacitor/issues/3110",
  "// TODO GH-ISSUE ionic-team/capacitor/issues/3110",
  "// todo gh-issue ionic-team/capacitor/issues/3110 with description",
  `/*
    * TODO gh-issue https://github.com/ionic-team/capacitor/issues/1893 workaround
    * TODO gh-issue https://github.com/ionic-team/capacitor/issues/1893 another hotfix
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
      code: "// const x = 'abc'",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
