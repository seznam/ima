import { StackFrame } from '#/entities';
import { ParsedError } from '#/types';

const TestError: ParsedError = {
  name: 'Syntax error',
  message: "Expected '{', got 'const'",
  type: 'compile',
  frames: [
    new StackFrame({
      rootDir: '/Users/jsimck/Desktop/wima',
      orgFileName: '/Users/jsimck/Desktop/wima/app/page/home/HomeView.jsx',
      orgLine: 7,
      orgColumn: 1,
      orgSourceFragment: [
        {
          line: ' 1',
          source:
            "import { useSettings, useLocalize } from '@ima/react-hooks';",
          highlight: false,
        },
        {
          line: ' 2',
          source: '',
          highlight: false,
        },
        {
          line: ' 3',
          source: "import Card from 'app/component/card/Card';",
          highlight: false,
        },
        {
          line: ' 4',
          source: "import './homeView.less';",
          highlight: false,
        },
        {
          line: ' 5',
          source: '',
          highlight: false,
        },
        {
          line: ' 6',
          source: 'export default function HomeView(props)',
          highlight: false,
        },
        {
          line: ' 7',
          source: "  const links = useSettings('links');",
          highlight: true,
        },
        {
          line: ' 8',
          source: '  const localize = useLocalize();',
          highlight: false,
        },
        {
          line: ' 9',
          source: '',
          highlight: false,
        },
        {
          line: '10',
          source: '  // asdfxxasdfasdfasdfx();',
          highlight: false,
        },
        {
          line: '11',
          source: '',
          highlight: false,
        },
        {
          line: '12',
          source: '  return (',
          highlight: false,
        },
        {
          line: '13',
          source: "    <div className='page-home'>",
          highlight: false,
        },
        {
          line: '14',
          source: "      <div className='content'>",
          highlight: false,
        },
        {
          line: '15',
          source: '        <h1>',
          highlight: false,
        },
      ],
    }),
  ],
};

export { TestError };
