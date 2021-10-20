/**
 * @fileoverview foobar
 * @author stefan breitenstein
 */
"use strict";
const request = require('sync-request');

const MESSAGE_ID_SHOW_ALL = 'MESSAGE_ID_SHOW_ALL';
const MESSAGE_ID_TICKET_IS_CLOSED = 'MESSAGE_ID_TICKET_IS_CLOSED';


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function toRequestObject() {
  return (comment) => {
    const lowerCaseString = comment.value.toLowerCase();
    if(!lowerCaseString.includes('gh-issue')){
      return {
        matching: false
      };
    }

    const removeBeforeSubstr = (str, subStr) => str.slice(str.indexOf(subStr) + subStr.length, str.length)
    const statement = removeBeforeSubstr(lowerCaseString, 'gh-issue').trim();
    const [issueUrl] = statement.split(' ');
    const desc = removeBeforeSubstr(lowerCaseString, issueUrl).trim();

    return {
      matching: true,
      issueUrl,
      desc,
      loc: comment.loc
    };
  }
}

const sendRequest = (bodyFn) => {
 return JSON.parse(request('POST', "https://eslint-open-gh-issue.stefanbreitenstein.workers.dev", {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      'user-agent': 'eslint-open-gh-issue-rule-agent'
    },
    body: JSON.stringify(bodyFn())
  }).getBody('utf8'));
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      [MESSAGE_ID_SHOW_ALL]: 'Issue {{url}}. ({{text}})',
      [MESSAGE_ID_TICKET_IS_CLOSED]: 'Issue {{url}} is closed. ({{text}})'
    },
    schema: [{
      type: 'object',
      properties: {
        showAll: {
          type: 'boolean',
          default: false
        },
        allowWarningComments: {
          type: 'boolean',
          default: false
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program() {
        const options = {...context.options[0]};
        const requestObject = context.getSourceCode()
          .getAllComments()
          .filter(token => token.type !== 'Shebang')
          .flatMap(comment => comment.value.split('\n').map(line => ({...comment, value: line})))
          .map(toRequestObject({context, options}))
          .filter(({matching}) => matching)
          .reduce((acc, cur) => ({...acc, [cur.issueUrl]: {...cur}}), {})

        const response = sendRequest(() => Object.keys(requestObject));
        Object.entries(requestObject)
          .filter(([key, value]) => response[key].state === 'closed')
          .forEach(([key, value]) => {
            context.report({
              node: null,
              loc: value.loc,
              messageId: MESSAGE_ID_TICKET_IS_CLOSED,
              data: {
                url: value.issueUrl,
                text: value.desc
              }
            });
          });
      }
    };
  },
};