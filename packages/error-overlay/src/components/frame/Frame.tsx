// import clsx from 'clsx';
// import { FunctionComponent } from 'react';
// import prismjs from 'prismjs';

// import { Icon } from '#/components';
// import { ErrorWrapper, FrameWrapper } from '#/reducers';

// import FrameHeader from './FrameHeader';

// import 'prismjs/components/prism-markup';
// import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-less';
// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-typescript';
// import './prismjs.less';

// export type FrameProps = {
//   errorId: ErrorWrapper['id'];
//   frameWrapper: FrameWrapper;
//   className?: string;
// };

// function getPrismLanguage(fileUri: string | undefined): {
//   grammar: prismjs.Grammar;
//   language: string;
// } {
//   let language = 'javascript';

//   switch (fileUri?.split('.').pop()) {
//     case 'jsx':
//     case 'tsx':
//       language = 'jsx';
//       break;

//     case 'js':
//       language = 'javascript';
//       break;

//     case 'ts':
//       language = 'typescript';
//       break;

//     case 'css':
//       language = 'css';
//       break;

//     case 'less':
//       language = 'less';
//       break;

//     case 'html':
//     case 'xml':
//     case 'svg':
//     case 'mathml':
//     case 'ssml':
//     case 'rss':
//     case 'atom':
//       language = 'markup';
//       break;
//   }

//   return { grammar: prismjs.languages[language], language };
// }

// const Frame: FunctionComponent<FrameProps> = ({
//   frameWrapper,
//   errorId,
//   className,
// }) => {
//   const { frame } = frameWrapper;
//   const sourceFragment = frameWrapper.showOriginal
//     ? frame.orgSourceFragment
//     : frame.sourceFragment;
//   const hasFragment =
//     Array.isArray(sourceFragment) && sourceFragment.length > 0;

//   const { grammar, language } = getPrismLanguage(
//     frame.orgFileName || frame.fileName
//   );

//   return (
//     <div
//       className={clsx(
//         'overflow-hidden mb-4 text-slate-50 bg-slate-700 rounded-md shadow-lg shadow-slate-700/50',
//         className
//       )}
//     >
//       <FrameHeader
//         frameWrapper={frameWrapper}
//         hasFragment={hasFragment}
//         errorId={errorId}
//       />

//       {!frameWrapper.isCollapsed && (
//         <div className='overflow-y-auto py-3 text-xs leading-5 text-slate-50 bg-slate-700 rounded-b-xl md:text-sm md:leading-6'>
//           {hasFragment ? (
//             <pre>
//               <code>
//                 {(frameWrapper.showOriginal
//                   ? frame.orgSourceFragment
//                   : frame.sourceFragment
//                 )?.map(line => (
//                   <div
//                     key={line.line}
//                     className={`flex items-center border-l-4 ${
//                       line.highlight
//                         ? 'bg-rose-500/20 border-rose-500'
//                         : 'border-transparent'
//                     }`}
//                   >
//                     <div className='px-2 mr-2 text-slate-400 border-r-2 border-slate-600/75 md:px-3 md:mr-3'>
//                       {line.line}
//                     </div>
//                     <div
//                       dangerouslySetInnerHTML={{
//                         __html: prismjs.highlight(
//                           line.source,
//                           grammar,
//                           language
//                         ),
//                       }}
//                     />
//                   </div>
//                 ))}
//               </code>
//             </pre>
//           ) : (
//             <div className='flex justify-center items-center py-2'>
//               <div className='flex items-center'>
//                 <Icon icon='alert' size='xs' className='mr-2 text-rose-400' />{' '}
//                 <span className='text-xs text-slate-400'>
//                   Original source fragment is not available.
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export { getPrismLanguage };
// export default Frame;
