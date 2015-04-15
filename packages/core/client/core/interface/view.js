import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * The View defines a UI for a controller and is usually bound to a single
 * controller and its state.
 *
 * @interface View
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class View {
	/**
	 * Initializes this view for use with the provided controller. This method is
	 * usually called automatically by the platform before rendering this view.
	 *
	 * Implementation note: This method must be overridden, the overriding
	 * implementation must set the {@codelink _view} field.
	 *
	 * The view should bind to the provided controller, and the rendered view
	 * instances should obtain state from the controller. Also, when a rendered
	 * view instance is unmounted from the UI, it should call the
	 * {@codelink deinit()} method of the controller.
	 *
	 * @method init
	 * @param {Core.Abstract.Controller} controller The controller that will be
	 *        using this view, and provide state to the rendered instances of
	 *        this view.
	 */
	init(controller) {}

	/**
	 * Renders this view into a React element and returns the created React
	 * element. This method creates a new React element every time it is called.
	 *
	 * @method getReactView
	 * @return {Vendor.React.ReactElement} This view rendered to a React element.
	 */
	getView() {}
}

ns.Core.Interface.View = View;