import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

/**
 * Feed input box for posting new feed items.
 */
export default class TextInput extends AbstractComponent {

	constructor(props, context) {
		super(props, context);

		this.state = {
			checkedCategory: this.getDefaultCategory(props)
		};
	}

	render() {
		let placeholder = this.localize('home.placeHolder');
		let sendText = this.localize('home.sendText');
		let radioCategories = this.getRadioCategories(
			this.props.categories,
			this.props.currentCategory
		);

		return (
			<div className='text-input'>
				<input
						type='text'
						ref='textInput'
						className='form-text-input'
						placeholder={placeholder}
						onKeyPress={(event)=>this.sendTextByKeys(event)} />
				<button
						className='form-button'
						onClick={(event)=>this.sendText(event)} >
					{sendText}
				</button>
				<div className='form-categories' ref='categories'>
					{radioCategories}
				</div>
			</div>
		);
	}

	getRadioCategories(categoryListEntity, currentCategory) {
		if (currentCategory || !categoryListEntity) {
			return null;
		}

		let categories = categoryListEntity.getCategories();
		return categories.map((category, index) => {
			return (
				<div
						className='radio-button' key={category.getId()}>
					<input
							id={'radio' + category.getId()}
							type='radio'
							name='radio-categories'
							defaultValue={category.getId()}
							onChange={event => this.setCheckedCategory(event)}
							defaultChecked={index === 0}/>
					<label htmlFor={'radio' + category.getId()}>
						{category.getName()}
					</label>
				</div>
			);
		});
	}

	sendText(event) {
		let text = this.refs.textInput.value.trim();
		this.refs.textInput.value = '';

		let category = this.state.checkedCategory;
		if (!category) {
			category = this.getDefaultCategory(this.props);
		}

		this.fire('addItemToFeed', {
			content: text,
			category: category ? Number(category.getId()) : null
		});
	}

	getDefaultCategory(props) {
		if (props.currentCategory) {
			return props.currentCategory;
		}

		if (props.categories) {
			let categories = props.categories.getCategories();
			if (categories.length > 0) {
				return categories[0];
			}
		}

		return null;
	}

	setCheckedCategory(event) {
		let checkedCategoryId = parseInt(event.currentTarget.value, 10);
		let category = this.props.categories.getCategoryById(checkedCategoryId);
		this.setState({ checkedCategory: category });
	}

	sendTextByKeys(event) {
		event.stopPropagation();
		if (event.which === 13 || event.keyCode === 13) {
			event.preventDefault();
			this.sendText(event);
		}
	}
}
