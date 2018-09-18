---
---

<div class="is-flex column">
  <img class="img" src="{{ '/img/imajs-logo.png?v=' | append: site.github.build_revision | relative_url }}" alt="IMA.js logo">
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
{% include separator.html icon="fa-star" %}
<h2 class="title has-text-centered">Features</h2>
<div id="features">
  <div class="columns">
    {% for feature in site.data.features-0 %}
      {% include feature.html text=feature.text title=feature.title %}
    {% endfor %}
  </div>
  <div class="columns">
    {% for feature in site.data.features-1 %}
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
<div class="columns">
  <div class="column">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title is-centered">
          <a href="https://www.seznamzpravy.cz" target="_blank">Seznamzpravy.cz</a>
        </p>
      </div>
      <div class="card-image">
        <figure class="image is-16by9">
          <img src="{{ '/img/references/seznamzpravy.png?v=' | append: site.github.build_revision | relative_url }}" alt="Seznamzpravy.cz Screenhot">
        </figure>
      </div>
      <div class="card-content">
        <p>Seznam Zprávy is one of the top Czech news platforms, which delivers compelling, diverse and visually engaging stories in the form of a video.</p>
      </div>
    </div>
  </div>
  <div class="column">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title is-centered">
          <a href="https://www.prozeny.cz" target="_blank">Prozeny.cz</a>
        </p>
      </div>
      <div class="card-image">
        <figure class="image is-16by9">
          <img src="{{ '/img/references/prozeny.png?v=' | append: site.github.build_revision | relative_url }}" alt="Prozeny.cz Screenhot">
        </figure>
      </div>
      <div class="card-content">
        <p>The biggest online lifestyle magazine for women in the Czech Republic. Current articles about fashion, health and lifestyle, living, family, and a great section of recipes.</p>
      </div>
    </div>
  </div>
  <div class="column">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title is-centered">
          <a href="htps://www.hry.cz" target="_blank">Hry.cz</a>
        </p>
      </div>
      <div class="card-image">
        <figure class="image is-16by9">
          <img src="{{ '/img/references/hry.png?v=' | append: site.github.build_revision | relative_url }}" alt="Hry.cz Screenhot">
        </figure>
      </div>
      <div class="card-content">
        <p>The Czech videogame portal where you find your next videogame to play. There are plenty of videogames for different devices, including on-line browser games.</p>
      </div>
    </div>
  </div>
</div>
<div class="columns">
  <div class="column">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title is-centered">
          <a href="https://www.seznam.cz/vychytavky" target="_blank">Seznam.cz/vychytavky</a>
        </p>
      </div>
      <div class="card-image">
        <figure class="image is-16by9">
          <img src="{{ '/img/references/vychytavky.png?v=' | append: site.github.build_revision | relative_url }}" alt="Seznam.cz/vychytavky Screenhot">
        </figure>
      </div>
      <div class="card-content">
        <p>The news feed of the Seznam.cz company where you can see the new features of all Seznam.cz services.</p>
      </div>
    </div>
  </div>
  <div class="column">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title is-centered">
          <a href="https://tv.seznam.cz" target="_blank">tv.seznam.cz</a>
        </p>
      </div>
      <div class="card-image">
        <figure class="image is-16by9">
          <img src="{{ '/img/references/tv.png?v=' | append: site.github.build_revision | relative_url }}" alt="tv.seznam.cz Screenhot">
        </figure>
      </div>
      <div class="card-content">
        <p>TV broadcast schedule for at least 14 days ahead, awailable for more than 100 most watched TV stations. Horizontal and vertical layout, notifications and social sharing is available.</p>
      </div>
    </div>
  </div>
  <div class="column"></div>
</div>
{% include separator.html icon="fa-server" %}
<h2 class="title has-text-centered">Platforms</h2>
<table class="table is-fullwidth">
  <tbody>
    <tr>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/ie.png?v=' | append: site.github.build_revision | relative_url }}" alt="IE 10+">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/edge.png?v=' | append: site.github.build_revision | relative_url }}" alt="Edge">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/firefox.png?v=' | append: site.github.build_revision | relative_url }}" alt="Firefox">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/chrome.png?v=' | append: site.github.build_revision | relative_url }}" alt="Chrome">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/safari.png?v=' | append: site.github.build_revision | relative_url }}" alt="Safari">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/opera.png?v=' | append: site.github.build_revision | relative_url }}" alt="Opera">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/ios-safari.png?v=' | append: site.github.build_revision | relative_url }}" alt="iOS">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/android-browser.png?v=' | append: site.github.build_revision | relative_url }}" alt="Android Browser">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/android.png?v=' | append: site.github.build_revision | relative_url }}" alt="Chrome for Android">
        </figure>
      </td>
      <td>IMA</td>
    </tr>
    <tr>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/cordova.png?v=' | append: site.github.build_revision | relative_url }}" alt="Cordova">
        </figure>
      </td>
      <td>
        <figure class="image is-48x48">
          <img src="{{ '/img/platforms/phonegap.png?v=' | append: site.github.build_revision | relative_url }}" alt="Phonegap">
        </figure>
      </td>
      <td colspan="7"></td>
      <td>SPA</td>
    </tr>
    <tr>
      <td colspan="9" class="has-text-weight-bold">Unsupported & Old Browsers</td>
      <td>MPA</td>
    </tr>
  </tbody>
</table>
<p class="has-text-centered">
  <strong>IMA</strong> runs as isomorphic-page application.
  <strong>MPA</strong> runs as multi-page application.
  <strong>SPA</strong> runs as single-page application.
</p>
{% include separator.html icon="fa-wrench" %}
<h2 id="technologies" class="title has-text-centered">Used Technologies</h2>
<div class="is-flex">
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
