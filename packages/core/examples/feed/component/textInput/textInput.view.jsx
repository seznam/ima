import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent(() => {

	ns.namespace('App.Component.TextInput');

	/**
	 * Feed input box for messaging.
	 * @class View
	 * @namespace App.Component.TextInput
	 * @module App
	 * @submodule Component
	 */
	/* jshint ignore:start */
	ns.App.Component.TextInput.View = React.createClass({
		render() {
			var placeholder = oc.get('$Dictionary').get('home.placeHolder');
			var sendText = oc.get('$Dictionary').get('home.sendText');
			var radioCategories = this.getRadioCategories(
					this.props.categories, this.props.currentCategory, this.props.checkedCategory);

			return (
				<div className="text-input">
					<input 	
							type="text"
							ref="textInput"
							className="form-text-input"
							placeholder={placeholder}
							onKeyPress={this.sendTextByKeys} />
					<button 
							className="form-button"
							onClick={this.sendText} >
						{sendText}
					</button>
					<div className="form-categories" ref="categories">
						{radioCategories}
					</div>
				</div>
			);
		},

		getRadioCategories(categoryListEntity, currentCategory, checkedCategory) {
			
			if (currentCategory) {
				return '';
			}

			if (categoryListEntity) {
				var categories = categoryListEntity.getCategories();
				return categories.map((category) => {
					var checked = false;
					
					if (checkedCategory.getId() === category.getId()) {
						checked = true;
					}

					return (
						<div 
							className="radio-button" key={"radio-category-"+category.getId()} >
							<input 
									id={"radio" + category.getId()}
									type="radio"
									name="radio-categories"
									value={category.getId()}
									onChange={this.setCheckedCategory}
									defaultChecked={checked} />
							<label htmlFor={"radio" + category.getId()}>
								{category.getName()}
							</label>
						</div>
					);
				});
			}

			return '';
		},
		
		sendText(e, id) {
			var text = this.refs.textInput.getDOMNode().value.trim();
			this.refs.textInput.getDOMNode().value = '';
			
			var dispatcher = oc.get('$Dispatcher');

			dispatcher.fire('addItemToFeed', {
				content: text,
				category: Number(this.props.checkedCategory.getId())
			});
		},

		setCheckedCategory(e) {
			var checked = e.currentTarget.value;
			var dispatcher = oc.get('$Dispatcher');
			dispatcher.fire('setCheckedInputCategory', checked);
		},

		sendTextByKeys(e) {
			e.stopPropagation();
			if (e.which == 13 || e.keyCode == 13) {
				e.preventDefault();
		        this.sendText(null, null);
		    }
		}
	});
	/* jshint ignore:end */
});
