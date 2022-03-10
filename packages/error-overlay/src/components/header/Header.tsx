// import { FunctionComponent } from 'react';

// import { Button, Icon } from '#/components';
// import { useBridgeInterface } from '#/hooks';
// import { ErrorWrapper } from '#/reducers';
// import { useErrorsStore } from '#/stores';

// export type HeaderProps = {
//   error: ErrorWrapper;
// };

// const Header: FunctionComponent<HeaderProps> = ({ error }) => {
//   const { closeOverlay, isSSRError } = useBridgeInterface();
//   const { dispatch, state } = useErrorsStore();

//   if (isSSRError) {
//     return null;
//   }

//   return (
//     <div className='flex justify-between items-center my-3'>
//       {error && state.errorIds.length > 1 ? (
//         <div className='flex items-center'>
//           <Button
//             size='xs'
//             onClick={() => dispatch({ type: 'previous' })}
//             className='mr-1'
//           >
//             <Icon icon='chevron' size='xs' className='-rotate-180' />
//           </Button>
//           <Button
//             size='xs'
//             onClick={() => dispatch({ type: 'next' })}
//             className='mr-3'
//           >
//             <Icon icon='chevron' size='xs' />
//           </Button>
//           <span className='text-xs text-slate-700 md:text-sm'>
//             <span className='font-bold'>
//               {state.errorIds.indexOf(error.id) + 1}
//             </span>{' '}
//             of <span className='font-bold'>{state.errorIds.length}</span> errors
//             are visible on the page
//           </span>
//         </div>
//       ) : (
//         <div />
//       )}
//       <Button onClick={closeOverlay} linkStyle>
//         <Icon icon='cross' size='lg' className='text-slate-700' />
//       </Button>
//     </div>
//   );
// };

// export default Header;
