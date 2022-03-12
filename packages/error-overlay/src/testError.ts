import { StackFrame } from '#/entities';
import { ParsedError } from '#/types';

const TestCompileError: ParsedError = {
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

const TestRuntimeError: ParsedError = {
  name: 'ReferenceError',
  message: 'xxxx is not defined',
  type: 'runtime',
  frames: [
    new StackFrame({
      fileName:
        'http://localhost:3001/static/hot/client.es.cbe96823a648b0455877.hot-update.js',
      line: 27,
      column: 5,
      sourceFragment: [
        {
          line: '19',
          source:
            'var _reactHooks = __webpack_require__(/*! @ima/react-hooks */ "./node_modules/@ima/react-hooks/index.js");',
          highlight: false,
        },
        {
          line: '20',
          source:
            'var _card = _interopRequireDefault(__webpack_require__(/*! app/component/card/Card */ "./app/component/card/Card.jsx"));',
          highlight: false,
        },
        {
          line: '21',
          source:
            'var _react = _interopRequireDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));',
          highlight: false,
        },
        {
          line: '22',
          source:
            '__webpack_require__(/*! ./homeView.less */ "./app/page/home/homeView.less");',
          highlight: false,
        },
        {
          line: '23',
          source: 'function HomeView(props) {',
          highlight: false,
        },
        {
          line: '24',
          source: '    _s();',
          highlight: false,
        },
        {
          line: '25',
          source: "    const links = (0, _reactHooks).useSettings('links');",
          highlight: false,
        },
        {
          line: '26',
          source: '    const localize = (0, _reactHooks).useLocalize();',
          highlight: false,
        },
        {
          line: '27',
          source: '    xxxx();',
          highlight: true,
        },
        {
          line: '28',
          source:
            '    return(/*#__PURE__*/ (0, _jsxDevRuntime).jsxDEV("div", {',
          highlight: false,
        },
        {
          line: '29',
          source: '        className: "page-home",',
          highlight: false,
        },
        {
          line: '30',
          source:
            '        children: /*#__PURE__*/ (0, _jsxDevRuntime).jsxDEV("div", {',
          highlight: false,
        },
        {
          line: '31',
          source: '            className: "content",',
          highlight: false,
        },
        {
          line: '32',
          source: '            children: [',
          highlight: false,
        },
        {
          line: '33',
          source:
            '                /*#__PURE__*/ (0, _jsxDevRuntime).jsxDEV("h1", {',
          highlight: false,
        },
        {
          line: '34',
          source: '                    children: [',
          highlight: false,
        },
        {
          line: '35',
          source: '                        props.message,',
          highlight: false,
        },
      ],
      functionName: 'HomeView',
      orgFileName: 'webpack://wima/app/page/home/HomeView.jsx',
      orgLine: 12,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: ' 4',
          source: "import React from 'react';",
          highlight: false,
        },
        {
          line: ' 5',
          source: "import './homeView.less';",
          highlight: false,
        },
        {
          line: ' 6',
          source: '',
          highlight: false,
        },
        {
          line: ' 7',
          source: 'export default function HomeView(props) {',
          highlight: false,
        },
        {
          line: ' 8',
          source: "  const links = useSettings('links');",
          highlight: false,
        },
        {
          line: ' 9',
          source: '  const localize = useLocalize();',
          highlight: false,
        },
        {
          line: '10',
          source: '',
          highlight: false,
        },
        {
          line: '11',
          source: '',
          highlight: false,
        },
        {
          line: '12',
          source: '  xxxx();',
          highlight: true,
        },
        {
          line: '13',
          source: '',
          highlight: false,
        },
        {
          line: '14',
          source: '  return (',
          highlight: false,
        },
        {
          line: '15',
          source: "    <div className='page-home'>",
          highlight: false,
        },
        {
          line: '16',
          source: "      <div className='content'>",
          highlight: false,
        },
        {
          line: '17',
          source: '        <h1>',
          highlight: false,
        },
        {
          line: '18',
          source: "          {props.message}{' '}",
          highlight: false,
        },
        {
          line: '19',
          source: '          <a',
          highlight: false,
        },
        {
          line: '20',
          source: "            href='https://imajs.io'",
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 40916,
      column: 28,
      sourceFragment: [
        {
          line: '40912',
          source: '                } else {',
          highlight: false,
        },
        {
          line: '40913',
          source:
            '                    ReactCurrentDispatcher$1.current = HooksDispatcherOnMountInDEV;',
          highlight: false,
        },
        {
          line: '40914',
          source: '                }',
          highlight: false,
        },
        {
          line: '40915',
          source: '            }',
          highlight: false,
        },
        {
          line: '40916',
          source:
            '            var children = Component(props, secondArg); // Check if there was a render phase update',
          highlight: true,
        },
        {
          line: '40917',
          source:
            '            if (didScheduleRenderPhaseUpdateDuringThisPass) {',
          highlight: false,
        },
        {
          line: '40918',
          source:
            '                // Keep rendering in a loop for as long as render phase updates continue to',
          highlight: false,
        },
        {
          line: '40919',
          source:
            '                // be scheduled. Use a counter to prevent infinite loops.',
          highlight: false,
        },
        {
          line: '40920',
          source: '                var numberOfReRenders = 0;',
          highlight: false,
        },
      ],
      functionName: 'renderWithHooks',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 14985,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '14981',
          source:
            '      ReactCurrentDispatcher$1.current = HooksDispatcherOnMountInDEV;',
          highlight: false,
        },
        {
          line: '14982',
          source: '    }',
          highlight: false,
        },
        {
          line: '14983',
          source: '  }',
          highlight: false,
        },
        {
          line: '14984',
          source: '',
          highlight: false,
        },
        {
          line: '14985',
          source:
            '  var children = Component(props, secondArg); // Check if there was a render phase update',
          highlight: true,
        },
        {
          line: '14986',
          source: '',
          highlight: false,
        },
        {
          line: '14987',
          source: '  if (didScheduleRenderPhaseUpdateDuringThisPass) {',
          highlight: false,
        },
        {
          line: '14988',
          source:
            '    // Keep rendering in a loop for as long as render phase updates continue to',
          highlight: false,
        },
        {
          line: '14989',
          source:
            '    // be scheduled. Use a counter to prevent infinite loops.',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 42999,
      column: 32,
      sourceFragment: [
        {
          line: '42995',
          source:
            '            prepareToReadContext(workInProgress, renderLanes);',
          highlight: false,
        },
        {
          line: '42996',
          source: '            {',
          highlight: false,
        },
        {
          line: '42997',
          source:
            '                ReactCurrentOwner$1.current = workInProgress;',
          highlight: false,
        },
        {
          line: '42998',
          source: '                setIsRendering(true);',
          highlight: false,
        },
        {
          line: '42999',
          source:
            '                nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);',
          highlight: true,
        },
        {
          line: '43000',
          source: '                if (workInProgress.mode & StrictMode) {',
          highlight: false,
        },
        {
          line: '43001',
          source: '                    disableLogs();',
          highlight: false,
        },
        {
          line: '43002',
          source: '                    try {',
          highlight: false,
        },
        {
          line: '43003',
          source:
            '                        nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);',
          highlight: false,
        },
      ],
      functionName: 'updateFunctionComponent',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 17356,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '17352',
          source: '',
          highlight: false,
        },
        {
          line: '17353',
          source: '  {',
          highlight: false,
        },
        {
          line: '17354',
          source: '    ReactCurrentOwner$1.current = workInProgress;',
          highlight: false,
        },
        {
          line: '17355',
          source: '    setIsRendering(true);',
          highlight: false,
        },
        {
          line: '17356',
          source:
            '    nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, context, renderLanes);',
          highlight: true,
        },
        {
          line: '17357',
          source: '',
          highlight: false,
        },
        {
          line: '17358',
          source: '    if ( workInProgress.mode & StrictMode) {',
          highlight: false,
        },
        {
          line: '17359',
          source: '      disableLogs();',
          highlight: false,
        },
        {
          line: '17360',
          source: '',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 44371,
      column: 32,
      sourceFragment: [
        {
          line: '44367',
          source: '                    {',
          highlight: false,
        },
        {
          line: '44368',
          source:
            '                        var _Component = workInProgress.type;',
          highlight: false,
        },
        {
          line: '44369',
          source:
            '                        var unresolvedProps = workInProgress.pendingProps;',
          highlight: false,
        },
        {
          line: '44370',
          source:
            '                        var resolvedProps = workInProgress.elementType === _Component ? unresolvedProps : resolveDefaultProps(_Component, unresolvedProps);',
          highlight: false,
        },
        {
          line: '44371',
          source:
            '                        return updateFunctionComponent(current, workInProgress, _Component, resolvedProps, renderLanes);',
          highlight: true,
        },
        {
          line: '44372',
          source: '                    }',
          highlight: false,
        },
        {
          line: '44373',
          source: '                case ClassComponent:',
          highlight: false,
        },
        {
          line: '44374',
          source: '                    {',
          highlight: false,
        },
        {
          line: '44375',
          source:
            '                        var _Component2 = workInProgress.type;',
          highlight: false,
        },
      ],
      functionName: 'beginWork',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 19063,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '19059',
          source: '      {',
          highlight: false,
        },
        {
          line: '19060',
          source: '        var _Component = workInProgress.type;',
          highlight: false,
        },
        {
          line: '19061',
          source: '        var unresolvedProps = workInProgress.pendingProps;',
          highlight: false,
        },
        {
          line: '19062',
          source:
            '        var resolvedProps = workInProgress.elementType === _Component ? unresolvedProps : resolveDefaultProps(_Component, unresolvedProps);',
          highlight: false,
        },
        {
          line: '19063',
          source:
            '        return updateFunctionComponent(current, workInProgress, _Component, resolvedProps, renderLanes);',
          highlight: true,
        },
        {
          line: '19064',
          source: '      }',
          highlight: false,
        },
        {
          line: '19065',
          source: '',
          highlight: false,
        },
        {
          line: '19066',
          source: '    case ClassComponent:',
          highlight: false,
        },
        {
          line: '19067',
          source: '      {',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 31687,
      column: 30,
      sourceFragment: [
        {
          line: '31683',
          source:
            '                    var funcArgs = Array.prototype.slice.call(arguments, 3);',
          highlight: false,
        },
        {
          line: '31684',
          source: '                    function callCallback() {',
          highlight: false,
        },
        {
          line: '31685',
          source: '                        didCall = true;',
          highlight: false,
        },
        {
          line: '31686',
          source: '                        restoreAfterDispatch();',
          highlight: false,
        },
        {
          line: '31687',
          source: '                        func.apply(context, funcArgs);',
          highlight: true,
        },
        {
          line: '31688',
          source: '                        didError = false;',
          highlight: false,
        },
        {
          line: '31689',
          source:
            '                    } // Create a global error event handler. We use this to capture the value',
          highlight: false,
        },
        {
          line: '31690',
          source:
            "                    // that was thrown. It's possible that this error handler will fire more",
          highlight: false,
        },
        {
          line: '31691',
          source:
            '                    // than once; for example, if non-React code also calls `dispatchEvent`',
          highlight: false,
        },
      ],
      functionName: 'HTMLUnknownElement.callCallback',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 3945,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '3941',
          source: '',
          highlight: false,
        },
        {
          line: '3942',
          source: '      function callCallback() {',
          highlight: false,
        },
        {
          line: '3943',
          source: '        didCall = true;',
          highlight: false,
        },
        {
          line: '3944',
          source: '        restoreAfterDispatch();',
          highlight: false,
        },
        {
          line: '3945',
          source: '        func.apply(context, funcArgs);',
          highlight: true,
        },
        {
          line: '3946',
          source: '        didError = false;',
          highlight: false,
        },
        {
          line: '3947',
          source:
            '      } // Create a global error event handler. We use this to capture the value',
          highlight: false,
        },
        {
          line: '3948',
          source:
            "      // that was thrown. It's possible that this error handler will fire more",
          highlight: false,
        },
        {
          line: '3949',
          source:
            '      // than once; for example, if non-React code also calls `dispatchEvent`',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 31725,
      column: 30,
      sourceFragment: [
        {
          line: '31721',
          source:
            "                    window.addEventListener('error', handleWindowError);",
          highlight: false,
        },
        {
          line: '31722',
          source:
            '                    fakeNode.addEventListener(evtType, callCallback, false); // Synchronously dispatch our fake event. If the user-provided function',
          highlight: false,
        },
        {
          line: '31723',
          source:
            '                    // errors, it will trigger our global error handler.',
          highlight: false,
        },
        {
          line: '31724',
          source: '                    evt.initEvent(evtType, false, false);',
          highlight: false,
        },
        {
          line: '31725',
          source: '                    fakeNode.dispatchEvent(evt);',
          highlight: true,
        },
        {
          line: '31726',
          source: '                    if (windowEventDescriptor) {',
          highlight: false,
        },
        {
          line: '31727',
          source:
            "                        Object.defineProperty(window, 'event', windowEventDescriptor);",
          highlight: false,
        },
        {
          line: '31728',
          source: '                    }',
          highlight: false,
        },
        {
          line: '31729',
          source: '                    if (didCall && didError) {',
          highlight: false,
        },
      ],
      functionName: 'Object.invokeGuardedCallbackDev',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 3994,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '3990',
          source:
            '      fakeNode.addEventListener(evtType, callCallback, false); // Synchronously dispatch our fake event. If the user-provided function',
          highlight: false,
        },
        {
          line: '3991',
          source: '      // errors, it will trigger our global error handler.',
          highlight: false,
        },
        {
          line: '3992',
          source: '',
          highlight: false,
        },
        {
          line: '3993',
          source: '      evt.initEvent(evtType, false, false);',
          highlight: false,
        },
        {
          line: '3994',
          source: '      fakeNode.dispatchEvent(evt);',
          highlight: true,
        },
        {
          line: '3995',
          source: '',
          highlight: false,
        },
        {
          line: '3996',
          source: '      if (windowEventDescriptor) {',
          highlight: false,
        },
        {
          line: '3997',
          source:
            "        Object.defineProperty(window, 'event', windowEventDescriptor);",
          highlight: false,
        },
        {
          line: '3998',
          source: '      }',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 31776,
      column: 41,
      sourceFragment: [
        {
          line: '31772',
          source: ' * @param {...*} args Arguments for function',
          highlight: false,
        },
        {
          line: '31773',
          source:
            ' */ function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {',
          highlight: false,
        },
        {
          line: '31774',
          source: '            hasError = false;',
          highlight: false,
        },
        {
          line: '31775',
          source: '            caughtError = null;',
          highlight: false,
        },
        {
          line: '31776',
          source:
            '            invokeGuardedCallbackImpl$1.apply(reporter, arguments);',
          highlight: true,
        },
        {
          line: '31777',
          source: '        }',
          highlight: false,
        },
        {
          line: '31778',
          source: '        /**',
          highlight: false,
        },
        {
          line: '31779',
          source:
            ' * Same as invokeGuardedCallback, but instead of returning an error, it stores',
          highlight: false,
        },
        {
          line: '31780',
          source:
            ' * it in a global so it can be rethrown by `rethrowCaughtError` later.',
          highlight: false,
        },
      ],
      functionName: 'invokeGuardedCallback',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 4056,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '4052',
          source: '',
          highlight: false,
        },
        {
          line: '4053',
          source:
            'function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {',
          highlight: false,
        },
        {
          line: '4054',
          source: '  hasError = false;',
          highlight: false,
        },
        {
          line: '4055',
          source: '  caughtError = null;',
          highlight: false,
        },
        {
          line: '4056',
          source: '  invokeGuardedCallbackImpl$1.apply(reporter, arguments);',
          highlight: true,
        },
        {
          line: '4057',
          source: '}',
          highlight: false,
        },
        {
          line: '4058',
          source: '/**',
          highlight: false,
        },
        {
          line: '4059',
          source:
            ' * Same as invokeGuardedCallback, but instead of returning an error, it stores',
          highlight: false,
        },
        {
          line: '4060',
          source:
            ' * it in a global so it can be rethrown by `rethrowCaughtError` later.',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 48269,
      column: 21,
      sourceFragment: [
        {
          line: '48265',
          source: '                    if (unitOfWork.mode & ProfileMode) {',
          highlight: false,
        },
        {
          line: '48266',
          source: '                        // Reset the profiler timer.',
          highlight: false,
        },
        {
          line: '48267',
          source: '                        startProfilerTimer(unitOfWork);',
          highlight: false,
        },
        {
          line: '48268',
          source: '                    } // Run beginWork again.',
          highlight: false,
        },
        {
          line: '48269',
          source:
            '                    invokeGuardedCallback(null, beginWork, null, current, unitOfWork, lanes);',
          highlight: true,
        },
        {
          line: '48270',
          source: '                    if (hasCaughtError()) {',
          highlight: false,
        },
        {
          line: '48271',
          source:
            '                        var replayError = clearCaughtError(); // `invokeGuardedCallback` sometimes sets an expando `_suppressLogging`.',
          highlight: false,
        },
        {
          line: '48272',
          source:
            '                        // Rethrow this error instead of the original one.',
          highlight: false,
        },
        {
          line: '48273',
          source: '                        throw replayError;',
          highlight: false,
        },
      ],
      functionName: 'beginWork$1',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 23964,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '23960',
          source: '        startProfilerTimer(unitOfWork);',
          highlight: false,
        },
        {
          line: '23961',
          source: '      } // Run beginWork again.',
          highlight: false,
        },
        {
          line: '23962',
          source: '',
          highlight: false,
        },
        {
          line: '23963',
          source: '',
          highlight: false,
        },
        {
          line: '23964',
          source:
            '      invokeGuardedCallback(null, beginWork, null, current, unitOfWork, lanes);',
          highlight: true,
        },
        {
          line: '23965',
          source: '',
          highlight: false,
        },
        {
          line: '23966',
          source: '      if (hasCaughtError()) {',
          highlight: false,
        },
        {
          line: '23967',
          source:
            '        var replayError = clearCaughtError(); // `invokeGuardedCallback` sometimes sets an expando `_suppressLogging`.',
          highlight: false,
        },
        {
          line: '23968',
          source: '        // Rethrow this error instead of the original one.',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 47325,
      column: 24,
      sourceFragment: [
        {
          line: '47321',
          source: '            setCurrentFiber(unitOfWork);',
          highlight: false,
        },
        {
          line: '47322',
          source: '            var next;',
          highlight: false,
        },
        {
          line: '47323',
          source:
            '            if ((unitOfWork.mode & ProfileMode) !== NoMode) {',
          highlight: false,
        },
        {
          line: '47324',
          source: '                startProfilerTimer(unitOfWork);',
          highlight: false,
        },
        {
          line: '47325',
          source:
            '                next = beginWork$1(current, unitOfWork, subtreeRenderLanes1);',
          highlight: true,
        },
        {
          line: '47326',
          source:
            '                stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);',
          highlight: false,
        },
        {
          line: '47327',
          source: '            } else {',
          highlight: false,
        },
        {
          line: '47328',
          source:
            '                next = beginWork$1(current, unitOfWork, subtreeRenderLanes1);',
          highlight: false,
        },
        {
          line: '47329',
          source: '            }',
          highlight: false,
        },
      ],
      functionName: 'performUnitOfWork',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 22776,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '22772',
          source: '  var next;',
          highlight: false,
        },
        {
          line: '22773',
          source: '',
          highlight: false,
        },
        {
          line: '22774',
          source: '  if ( (unitOfWork.mode & ProfileMode) !== NoMode) {',
          highlight: false,
        },
        {
          line: '22775',
          source: '    startProfilerTimer(unitOfWork);',
          highlight: false,
        },
        {
          line: '22776',
          source:
            '    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);',
          highlight: true,
        },
        {
          line: '22777',
          source:
            '    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);',
          highlight: false,
        },
        {
          line: '22778',
          source: '  } else {',
          highlight: false,
        },
        {
          line: '22779',
          source:
            '    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);',
          highlight: false,
        },
        {
          line: '22780',
          source: '  }',
          highlight: false,
        },
      ],
    }),
    new StackFrame({
      fileName: 'http://localhost:3001/static/js.es/vendors.js?version=gcckr',
      line: 47274,
      column: 17,
      sourceFragment: [
        {
          line: '47270',
          source:
            '        } // The work loop is an extremely hot path. Tell Closure not to inline it.',
          highlight: false,
        },
        {
          line: '47271',
          source: '        /** @noinline */ function workLoopSync() {',
          highlight: false,
        },
        {
          line: '47272',
          source:
            '            // Already timed out, so perform work without checking if we need to yield.',
          highlight: false,
        },
        {
          line: '47273',
          source: '            while(workInProgress1 !== null){',
          highlight: false,
        },
        {
          line: '47274',
          source: '                performUnitOfWork(workInProgress1);',
          highlight: true,
        },
        {
          line: '47275',
          source: '            }',
          highlight: false,
        },
        {
          line: '47276',
          source: '        }',
          highlight: false,
        },
        {
          line: '47277',
          source: '        function renderRootConcurrent(root, lanes) {',
          highlight: false,
        },
        {
          line: '47278',
          source: '            var prevExecutionContext = executionContext;',
          highlight: false,
        },
      ],
      functionName: 'workLoopSync',
      orgFileName:
        'webpack://wima/node_modules/react-dom/cjs/react-dom.development.js',
      orgLine: 22707,
      orgColumn: 0,
      orgSourceFragment: [
        {
          line: '22703',
          source: '',
          highlight: false,
        },
        {
          line: '22704',
          source: 'function workLoopSync() {',
          highlight: false,
        },
        {
          line: '22705',
          source:
            '  // Already timed out, so perform work without checking if we need to yield.',
          highlight: false,
        },
        {
          line: '22706',
          source: '  while (workInProgress !== null) {',
          highlight: false,
        },
        {
          line: '22707',
          source: '    performUnitOfWork(workInProgress);',
          highlight: true,
        },
        {
          line: '22708',
          source: '  }',
          highlight: false,
        },
        {
          line: '22709',
          source: '}',
          highlight: false,
        },
        {
          line: '22710',
          source: '',
          highlight: false,
        },
        {
          line: '22711',
          source: 'function renderRootConcurrent(root, lanes) {',
          highlight: false,
        },
      ],
    }),
  ],
};

export { TestCompileError, TestRuntimeError };
