
import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

const PRIVATE = {
	contextTypes: Symbol('contextTypes')
};
if ($Debug) {
	Object.freeze(PRIVATE);
}

export function getContextTypes(classConstructor) {
	if (classConstructor.hasOwnProperty(PRIVATE.contextTypes)) {
		return this[PRIVATE.contextTypes];
	}

	return {
		$Utils: React.PropTypes.object.isRequired
	};
}

export function setContextTypes(classConstructor, contextTypes) {
	return classConstructor[PRIVATE.contextTypes] = contextTypes;
}

export function getUtils(props, context) {
	const utils = context ? context.$Utils || props.$Utils : props.$Utils;

	if ($Debug && !utils) {
		throw new Error(
			'The component cannot access the view utils because they were ' +
			'not passed in the initial props or context as $Utils.'
		);
	}

	return utils;
}

export function localize(component, key, params) {
	return component.utils.$Dictionary.get(key, params);
}

export function link(component, name, params) {
	return component.utils.$Router.link(name, params);
}

export function cssClasses(component, classRules, includeComponentClassName) {
	return classnames(
		classRules,
		includeComponentClassName ? component.props.className : ''
	);
}

export function fire(component, eventName, data = null) {
	return component.utils.$EventBus.fire(
		ReactDOM.findDOMNode(component),
		eventName,
		data
	);
}

export function listen(component, eventTarget, eventName, listener) {
	if (!eventTarget.addEventListener) { // Safari doesn't have EventTarget
		eventTarget = ReactDOM.findDOMNode(eventTarget);
	}

	return component.utils.$EventBus.listen(eventTarget, eventName, listener);
}

export function unlisten(component, eventTarget, eventName, listener) {
	if (!eventTarget.addEventListener) { // Safari doesn't have EventTarget
		eventTarget = ReactDOM.findDOMNode(eventTarget);
	}

	const eventBus = component.utils.$EventBus;
	return eventBus.unlisten(eventTarget, eventName, listener);
}
