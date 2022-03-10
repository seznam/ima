// import clsx from 'clsx';
// import { FunctionComponent } from 'react';

// import { Button, Icon } from '#/components';
// import { useOpenEditor } from '#/hooks';
// import { ErrorWrapper, FrameWrapper } from '#/reducers/errorsReducer';
// import { useErrorsStore } from '#/stores';

// export type FrameHeaderProps = {
//   errorId: ErrorWrapper['id'];
//   frameWrapper: FrameWrapper;
//   hasFragment: boolean;
// };

// const FrameHeader: FunctionComponent<FrameHeaderProps> = ({
//   frameWrapper,
//   errorId,
//   hasFragment,
// }) => {
//   const { dispatch, currentError } = useErrorsStore();
//   const { openEditor, isLoading } = useOpenEditor();

//   const { frame } = frameWrapper;
//   const fileUriParts = (
//     frameWrapper.showOriginal || currentError?.type === 'compile'
//       ? [frame.getPrettyOriginalFileUri(), frame.orgLine, frame.orgColumn]
//       : [frame.fileName, frame.line, frame.column]
//   ).filter(Boolean);

//   return (
//     <div
//       className={clsx(
//         'flex relative justify-between items-center border-slate-600 shadow-lg shadow-slate-800/25',
//         { 'border-b': !frameWrapper.isCollapsed }
//       )}
//     >
//       <button
//         onClick={() =>
//           dispatch({
//             type: frameWrapper.isCollapsed ? 'expand' : 'collapse',
//             payload: { errorId, frameId: frameWrapper.id },
//           })
//         }
//         className='flex overflow-y-auto justify-start items-center py-1 px-3 hover:bg-slate-600 active:bg-slate-500 rounded-tl-md border-r border-b-2 border-r-slate-600 border-b-cyan-500 transition-all md:py-2 md:px-4'
//       >
//         <div className='mr-3 text-slate-400/50 md:mr-4'>
//           <Icon
//             icon='chevron'
//             className={clsx('transition-transform', {
//               'rotate-90': !frameWrapper.isCollapsed,
//             })}
//           />
//         </div>
//         <div
//           style={{ height: '40px' }}
//           className='flex flex-col grow-0 justify-center items-start text-left'
//         >
//           <div className='flex items-center text-xs leading-5 whitespace-nowrap md:text-sm md:leading-6'>
//             {!hasFragment && (
//               <Icon icon='alert' size='xs' className='mr-1 text-rose-400' />
//             )}
//             {currentError?.type === 'compile'
//               ? frame.getPrettyFileName()
//               : frame.getFunctionName()}
//           </div>
//           {fileUriParts.length > 0 && (
//             <div className='text-[0.65rem] text-slate-400 whitespace-nowrap md:text-xs'>
//               {fileUriParts.join(':')}
//             </div>
//           )}
//         </div>
//       </button>

//       <div className='flex px-2 md:px-4'>
//         {currentError?.type !== 'compile' && (
//           <Button
//             className='p-1 md:p-2'
//             linkStyle
//             size='xs'
//             color={frameWrapper.showOriginal ? 'green' : 'light'}
//             onClick={() =>
//               dispatch({
//                 type: frameWrapper.showOriginal
//                   ? 'viewCompiled'
//                   : 'viewOriginal',
//                 payload: { errorId, frameId: frameWrapper.id },
//               })
//             }
//           >
//             {frameWrapper.showOriginal ? (
//               <Icon icon='openEye' />
//             ) : (
//               <Icon icon='closedEye' />
//             )}
//           </Button>
//         )}

//         <Button
//           className='p-1 md:p-2'
//           onClick={() => openEditor(frameWrapper)}
//           disabled={!hasFragment || isLoading}
//           size='xs'
//           linkStyle
//           color='light'
//         >
//           <Icon className={clsx({ 'animate-bounce': isLoading })} icon='edit' />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default FrameHeader;
