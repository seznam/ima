---
---

<div id="imajs">
  <div class="is-flex is-flex-column is-limited-width">
    <figure class="image is-3by1">
      <img src="{{ '/img/imajs-logo.png?v=' | append: site.github.build_revision | relative_url }}" alt="IMA.js logo">
    </figure>
    <h1 class="title has-text-centered">IMA.js is a framework for creating isomorphic javascript applications.</h1>
    <p class="has-text-centered">
      <a href="https://github.com/seznam/IMA.js-skeleton/archive/master.zip" class="button is-primary">
          <span class="icon">
            <i class="fas fa-download"></i>
          </span>
          <span>Download Latest</span>
      </a>
    </p>
  </div>
</div>
{% include separator.html icon="fa-star" %}
<h2 class="title has-text-centered">Features</h2>
<div id="features">
  <div class="columns is-limited-width">
    {% for feature in site.data.features limit:3 %}
      {% include feature.html text=feature.text title=feature.title %}
    {% endfor %}
  </div>
  <div class="columns is-limited-width">
    {% for feature in site.data.features offset:3 %}
      {% include feature.html text=feature.text title=feature.title %}
    {% endfor %}
  </div>
  <h3 class="title has-text-centered is-size-4">
    <span>...and more</span>
    <span class="icon">
      <i class="fas fa-caret-down has-text-primary"></i>
    </span>
  </h3>
  <ul class="has-text-centered">
    {% for feature in site.data.features-more %}
      {% include feature-more.html text=feature.text %}
    {% endfor %}
  </ul>
</div>
{% include separator.html icon="fa-newspaper" %}
<h2 class="title has-text-centered">References</h2>
<div id="references">
  <div class="columns is-limited-width">
    {% for reference in site.data.references limit:2 %}
      {% include reference.html img=reference.img text=reference.text title=reference.title url=reference.url %}
    {% endfor %}
  </div>
  <div class="columns is-limited-width">
    {% for reference in site.data.references offset:2 limit:2 %}
      {% include reference.html img=reference.img text=reference.text title=reference.title url=reference.url %}
    {% endfor %}
  </div>
  <div class="columns is-limited-width">
    {% for reference in site.data.references offset:4 limit:2 %}
      {% include reference.html img=reference.img text=reference.text title=reference.title url=reference.url %}
    {% endfor %}
  </div>
</div>
{% include separator.html icon="fa-server" %}
<h2 class="title has-text-centered">Platforms</h2>
<div id="platforms">
  <div class="columns is-centered is-limited-width">
    {% for platform in site.data.platforms-ima %}
      {% include platform.html img=platform.img title=platform.title %}
    {% endfor %}
    <div class="column is-3 has-text-weight-bold has-text-right has-text-centered-mobile">IMA</div>
  </div>
  <div class="columns is-centered is-limited-width">
    {% for platform in site.data.platforms-spa %}
      {% include platform.html img=platform.img title=platform.title %}
    {% endfor %}
    <div class="column is-10 has-text-weight-bold has-text-right has-text-centered-mobile">SPA</div>
  </div>
  <div class="columns is-centered is-limited-width">
    <div class="column is-11 has-text-weight-bold has-text-left has-text-centered-mobile">Unsupported & Old Browsers</div>
    <div class="column has-text-weight-bold has-text-right has-text-centered-mobile">MPA</div>
  </div>
  <p class="has-text-centered">
    <strong>IMA</strong> runs as isomorphic-page application.
    <strong>MPA</strong> runs as multi-page application.
    <strong>SPA</strong> runs as single-page application.
  </p>
</div>
{% include separator.html icon="fa-wrench" %}
<h2 id="technologies" class="title has-text-centered">Used Technologies</h2>
<div class="is-flex is-limited-width">
  <a href="https://nodejs.org/" title="NodeJS" target="_blank">
    <img src="{{ '/img/technologies/nodejs.png?v=' | append: site.github.build_revision | relative_url }}" alt="NodeJS"/>
  </a>
  <a href="https://facebook.github.io/react/" title="React" target="_blank">
    <img src="{{ '/img/technologies/react.png?v=' | append: site.github.build_revision | relative_url }}" alt="React"/>
  </a>
  <a href="http://es6-features.org/" title="JS ECMAScript6" target="_blank">
    <img src="{{ '/img/technologies/es6.png?v=' | append: site.github.build_revision | relative_url }}" alt="JS ECMAScript6"/>
  </a>
  <a href="http://expressjs.com/" title="Express" target="_blank">
    <img src="{{ '/img/technologies/express.png?v=' | append: site.github.build_revision | relative_url }}" alt="Express"/>
  </a>
</div>
