import prismjs from 'prismjs';

import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';

function getPrismLanguage(fileUri: string | undefined): {
  grammar: prismjs.Grammar;
  language: string;
} {
  let language = 'javascript';

  switch (fileUri?.split('.').pop()) {
    case 'jsx':
    case 'tsx':
      language = 'jsx';
      break;

    case 'js':
      language = 'javascript';
      break;

    case 'ts':
      language = 'typescript';
      break;

    case 'css':
      language = 'css';
      break;

    case 'less':
      language = 'less';
      break;

    case 'json':
      language = 'json';
      break;

    case 'html':
    case 'xml':
    case 'svg':
    case 'mathml':
    case 'ssml':
    case 'rss':
    case 'atom':
      language = 'markup';
      break;
  }

  return { grammar: prismjs.languages[language], language };
}

export { getPrismLanguage };
