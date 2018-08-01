/**
 * 
 */
export default class PageManagerHandler {

	/**
	 * Called before a PageManager starts to transition from previous page to
	 * a new one.
	 * 
	 * @param {ManagedPage} managedPage
	 * @param {ManagedPage} nextManagedPage
	 */
	handlePreManage() {}
	
	/**
	 * Called after a PageManager finishes transition from previous page to
	 * a new one.
	 * 
	 * @param {ManagedPage} managedPage
	 * @param {ManagedPage} previousManagedPage
	 */
	handlePostManage() {}
}