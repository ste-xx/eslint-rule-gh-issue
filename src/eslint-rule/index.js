'use strict';
// eslint does not support async stuff
import request from 'sync-request';
const MESSAGE_ID_SHOW_ALL = 'MESSAGE_ID_SHOW_ALL';
const MESSAGE_ID_TICKET_IS_CLOSED = 'MESSAGE_ID_TICKET_IS_CLOSED';

function parseTodoWithArguments(string) {
  const lowerCaseString = string.toLowerCase();
  const hasGhIssueTodoStatement = lowerCaseString.includes('todo gh-issue');
  if (!hasGhIssueTodoStatement) {
    return;
  }
  const urlAndText = lowerCaseString
    .replace('todo gh-issue', '')
    .trim();
  const [url] = urlAndText.split(' ');
  return {
    url,
    api: url.replace('//github.com/', '//api.github.com/repos/'),
    text: urlAndText.slice(url.length + 1).trim()
  };
}

function processCommentWith({context, options}) {
  return (comment) => {
    console.warn(comment);
    // const parsed = parseTodoWithArguments(comment.value);
    // if (parsed === undefined) {
    //   return;
    // }
    // if (options.showAll) {
    //   context.report({
    //     node: null,
    //     loc: comment.loc,
    //     messageId: MESSAGE_ID_SHOW_ALL,
    //     data: parsed
    //   });
    //   return;
    // }
    //
    // const res = request('GET', parsed.api, {
    //   headers: {
    //     'user-agent': 'eslint-open-gh-issue-rule-agent'
    //   }
    // });
    // const result = JSON.parse(res.getBody('utf8'));
    // const issueIsClosed = result.state === 'closed';
    // if (issueIsClosed) {
    //   context.report({
    //     node: null,
    //     loc: comment.loc,
    //     messageId: MESSAGE_ID_TICKET_IS_CLOSED,
    //     data: parsed
    //   });
    // }
  };
}

const create = (context) => {
  return {
    Program() {
      const options = {...context.options[0]};
      const sourceCode = context.getSourceCode();
      sourceCode
        .getAllComments()
        .filter(token => token.type !== 'Shebang')
        // Block comments come as one.
        // Split for situations like this:
        // /*
        //  * TODO gh-issue https://github.com/ionic-team/capacitor/issues/1893 workaround
        //  * TODO gh-issue https://github.com/ionic-team/capacitor/issues/2999 another hotfix
        //  * TODO gh-issue https://github.com/ionic-team/capacitor/issues/3110 validate also this
        //  */
        .flatMap(comment =>
          comment.value.split('\n').map(line => ({
            ...comment,
            value: line
          }))
        )
        .forEach(processCommentWith({context, options}));
    }
  };
};

const schema = [
  {
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
  }
];

module.exports = {
  create,
  meta: {
    type: 'suggestion',
    messages: {
      [MESSAGE_ID_SHOW_ALL]: 'Issue {{url}}. ({{text}})',
      [MESSAGE_ID_TICKET_IS_CLOSED]: 'Issue {{url}} is closed. ({{text}})'
    },
    schema
  }
};
