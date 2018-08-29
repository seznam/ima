---
layout: null
---

const HIDDEN_CLASS = 'hidden';
const PREFIX_URL = '{{ 'doc/' | relative_url }}';

const lunrDocuments = {{ site.data.lunr | jsonify }};
const lunrIndex = lunr(function() {
	this.ref('name');
	this.field('text');

	lunrDocuments.forEach(function(doc) {
		this.add(doc);
	}, this);
});

const menuElement = document.getElementById('menu');
const resultsCloseElement = document.getElementById('results-close');
const resultsCountElement = document.getElementById('results-count');
const resultsElement = document.getElementById('results');
const resultsListElement = document.getElementById('results-list');
const searchInput = document.getElementById('search');
const searchTimeout = null;

resultsCloseElement.addEventListener('click', () => {
	menuElement.classList.remove(HIDDEN_CLASS);
	resultsElement.classList.add(HIDDEN_CLASS);
	searchInput.value = '';
	resultsListElement.innerHTML = '';
});

searchInput.addEventListener('keydown', () => {
	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}

	searchTimeout = setTimeout(() => {
		const results = lunrIndex.search(searchInput.value);

		menuElement.classList.add(HIDDEN_CLASS);
		resultsElement.classList.remove(HIDDEN_CLASS);

		resultsCountElement.innerHTML = results.length;

		let resultHtml = '';
		if (results.length) {
			results.forEach(result => {
				const document = lunrDocuments.find(element => element.name === result.ref);

				resultHtml += `<li><a href="${PREFIX_URL}${document.url}">${document.name}</a></li>`;
			});
		}

		resultsListElement.innerHTML = resultHtml;
	}, 500)
});
