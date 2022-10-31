import { useMemo } from 'react';

import { usePageContext } from './pageContext';

/**
 * Base hook you can use to initialize your component.
 *
 * Returns object, which gives you access to the same features you would
 * get in your class component:
 *  - Utility methods: cssClasses, localize, link, fire, listen, unlisten.
 *  - Objects: utils (=== ComponentUtils).
 *
 * @example
 * const { utils, cssClasses } = useComponent();
 * @returns {{
 * 	utils: Object<string, Object>
 * 	cssClasses: function(...(string|Object<string, boolean>|string[])): string
 * 	localize: function(string, ?object)
 * 	link: function(string, Object<string, Object>)
 * 	fire: function(string, ?object=)
 * 	listen: function((React.Element|EventTarget), string, function(Event))
 * 	unlisten: function((React.Element|EventTarget), string, function(Event))
 * }} object containing context data and utility methods.
 */
export default function useComponent() {
  const { $Utils } = usePageContext();

  return useMemo(
    () => ({
      utils: $Utils,
      cssClasses: (...params) => $Utils.$CssClasses(...params),
      localize: (...params) => $Utils.$Dictionary.get(...params),
      link: (...params) => $Utils.$Router.link(...params),
      fire: (...params) => $Utils.$EventBus.fire(...params),
      listen: (...params) => $Utils.$EventBus.listen(...params),
      unlisten: (...params) => $Utils.$EventBus.unlisten(...params)
    }),
    [$Utils]
  );
}

export { useComponent };
