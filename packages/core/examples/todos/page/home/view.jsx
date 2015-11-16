import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Page.Home');

class View extends ns.Core.Abstract.Component {

	render() {
		var Item = ns.App.Component.Item.View;

		return (
			<div className='l-home'>
				<section className='todoapp'>
					<header id='header'>
						<h1>{this.localize('title')}</h1>
						<input
								className='new-todo'
								placeholder={this.localize('new item placeholder')}
								ref='newItem'
								onBlur={(e) => this.onItemAdded(e)}
								onKeyUp={(e) => this.onKeyUp(e)}/>
					</header>
					<section className='main'>
						<input
								id='toggle-all'
								className='toggle-all'
								type='checkbox'
								ref='toggleAll'
								onChange={(e) => this.onToggleAll(e)}
								checked={this.props.toggleAllChecked}/>
						<label htmlFor='toggle-all'>{this.localize('toggle all label')}</label>
						<ul className='todo-list'>
							{this.props.items.map((item) => {
								return <Item item={item} key={item.id} $Utils={this.utils}/>
							})}
						</ul>
					</section>
					<footer className='footer'>
						<span className='todo-count'>
							<strong>{this.props.items.filter(item => !item.completed).length}</strong>
							{this.localize('count', { COUNT: this.props.items.filter(item => !item.completed).length })}
						</span>
						<ul className='filters'>
							<li>
								<a href={this.utils.$Router.link('home', {})} className={this.props.filter === null ? 'selected' : ''}>
									{this.localize('filters: all')}
								</a>
							</li>
							<li>
								<a href={this.utils.$Router.link('filtered', { filter: 'active' })} className={this.props.filter === false ? 'selected' : ''}>
									{this.localize('filters: active')}
								</a>
							</li>
							<li>
								<a href={this.utils.$Router.link('filtered', { filter: 'completed' })} className={this.props.filter === true ? 'selected' : ''}>
									{this.localize('filters: completed')}
								</a>
							</li>
						</ul>
						<button onClick={(e) => this.onDeleteCompleted(e)} className={
							'clear-completed' +
							(this.props.items.every(item => !item.completed) ? ' hidden' : '')
						}>{this.localize('clear completed')}</button>
					</footer>
				</section>
				<footer className='info'>
					<p>{this.localize('info: edit')}</p>
					<p>{this.localize('info: created by')}</p>
					<p>Part of <a href='http://todomvc.com'>TodoMVC</a></p>
				</footer>
			</div>
		);
	}

	onKeyUp(event) {
		if (event.keyCode === 13) {
			this.onItemAdded();
		}
	}

	onItemAdded() {
		var newItemInput = this.findDOMNode(this.refs.newItem);
		if (newItemInput.value) {
			this.utils.$EventBus.fire(newItemInput, 'itemCreated', {
				title: newItemInput.value
			});
			newItemInput.value = '';
		}
	}

	onToggleAll(event) {
		var toggleAll = this.findDOMNode(this.refs.toggleAll);
		this.utils.$EventBus.fire(event.target, 'toggleAll', {
			completed: toggleAll.checked
		});
	}

	onDeleteCompleted(event) {
		this.utils.$EventBus.fire(event.target, 'completedItemsDeleted');
	}

	componentDidMount() {
		var newItemInput = this.findDOMNode(this.refs.newItem);
		newItemInput.focus();
	}

	localize(key, params) {
		return this.utils.$Dictionary.get(`home.${key}`, params);
	}
}

ns.App.Page.Home.View = View;

