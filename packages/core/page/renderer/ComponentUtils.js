
export default class ComponentUtils {

    /**
     * Initializes the registry used for managing component utils.
     *
     * @param {ObjectContainer} oc The application's dependency injector - the
     *        object container.
     */
    constructor(oc) {
        /**
         * The application's dependency injector - the object container.
         *
         * @type {ObjectContainer}
         */
        this._oc = oc;

        /**
         * Map of registered utilities.
         * 
         * @type {Object<string, Object>}
         */
        this._utilities = {};
    }

    /**
     * Registers single utility class or multiple classes in alias->class mapping.
     * 
     * @param {function(new: Object)|Object<string, function(new: Object)>} componentUtilityClass
     * @param {string|null} alias
     * @returns {Object|Object<string, Object>}
     */
    register(componentUtilityClass, alias = null) {
        if (typeof componentUtilityClass === 'function') {

            const utilityInstance = this._oc.get(componentUtilityClass);
            this._utilities[alias || componentUtilityClass.name] = utilityInstance;

            return utilityInstance;

        } else if (typeof componentUtilityClass === 'object') {
            const utilityInstances = {};

            for (const alias of Object.keys(componentUtilityClass)) {
                const instance = this._oc.get(componentUtilityClass);

                this._utilities[alias] = instance;
                utilityInstances[alias] = instance;
            }

            return utilityInstances;
        }
    }

    /**
     * Returns object containing all registered utilities
     * 
     * @returns {Object<string, Object>}
     */
    getUtils() {
        return this._utilities;
    }
}