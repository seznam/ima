/**
 * An action object describing what triggered the routing.
 */
type PageHandlerAction = {
    type: string;
    event: PopStateEvent;
    url: string;
}

export default PageHandlerAction;
