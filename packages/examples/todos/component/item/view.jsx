import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Component.Item');

class View extends ns.Core.Abstract.Component {
	constructor(props) {
		super(props);

		this.state = {
			editing: false
		};
	}

	render() {
		return (
			<li
					className={
						(this.props.item.completed ? 'completed' : '') + (this.state.editing ? ' editing' : '')
					}>
				<div className='view'>
					<input
							className='toggle'
							type='checkbox'
							checked={this.props.item.completed}
							onChange={(e) => this.onCompletionToggled(e)}/>
					<label onDoubleClick={(e) => this.onStartEdit(e)}>
						{this.props.item.title}
					</label>
					<button className='destroy' onClick={(e) => this.onDelete(e)}></button>
				</div>
				{this._generateEditUI()}
			</li>
		);
	}

	onDelete(event) {
		this.utils.$EventBus.fire(event.target, 'itemDeleted', {
			item: this.props.item
		});
	}

	onCompletionToggled(event) {
		this.utils.$EventBus.fire(event.target, 'itemCompletionToggled', {
			item: this.props.item
		});
	}

	onStartEdit() {
		this.setState({
			editing: true
		});
	}

	onFinishEditing(event) {
		var editInput = this.findDOMNode(this.refs.edit);
		var newTitle = editInput.value;

		if (newTitle !== this.props.item.title) {
			this.utils.$EventBus.fire(event.targer, 'itemEdited', {
				item: this.props.item,
				newTitle: newTitle
			});
		}

		this.setState({
			editing: false
		});
	}

	componentDidUpdate() {
		if (!this.state.editing) {
			return;
		}

		var editInput = this.findDOMNode(this.refs.edit);
		editInput.focus();
	}

	_generateEditUI() {
		if (!this.state.editing) {
			return null;
		}

		return (
			<input
					className='edit'
					ref='edit'
					defaultValue={this.props.item.title}
					onBlur={this.onFinishEditing.bind(this)}/>
		);
	}
}

ns.App.Component.Item.View = View;
