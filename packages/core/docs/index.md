---
---

<div class="is-flex column">
  <img class="img" src="{{ '/img/imajs-logo.png?v=' | append: site.github.build_revision | relative_url }}" alt="IMA.js logo">
  <h1 class="title has-text-centered">IMA.js is a framework for creating isomorphic javascript applications</h1>
  <p class="has-text-centered">
    <a href="https://github.com/seznam/IMA.js-skeleton/archive/master.zip" class="button is-primary">
        <span class="icon">
          <i class="fas fa-download"></i>
        </span>
        <span>Download Latest</span>
    </a>
  </p>
</div>
<div class="level separator">
  <div class="level-item">
    <span class="fa-stack fa-2x">
      <i class="fas fa-circle fa-stack-2x has-text-primary"></i>
      <i class="fas fa-star fa-stack-1x has-text-white"></i>
    </span>
  </div>
</div>
<h2 class="title has-text-centered">Features</h2>
<div class="columns">
  <div class="column">
    <h3 class="title is-4">Fully Isomorphic</h3>
    <p>
      Write and run the same code at both the server side and the client side! IMA.js provides abstraction for APIs that differ at the client side javascript and the server side javascript.
    </p>
  </div>
  <div class="column">
    <h3 class="title is-4">SEO</h3>
    <p>
      Page metadata are centrally managed, allowing easier <a href="{{ '/doc/meta/meta-meta-manager-impl.html' | relative_url }}">management</a> of all your keywords and og meta-tags.
    </p>
  </div>
  <div class="column">
    <h3 class="title is-4">Benchmarks and Tests</h3>
    <p>
      Real-world heavy-load web services are run on the IMA.js platform. With hundreds of <a href="https://github.com/seznam/IMA.js-core" target="_blank">unit tests</a> covering all of our code, you can rely on IMA.js to be a stable base of your application.
    </p>
  </div>
</div>
<div class="columns">
  <div class="column">
    <h3 class="title is-4">Production-ready Full Application Stack</h3>
    <p>
      Use the familiar MVC pattern in combination with React for rendering your UI. See <a href="https://github.com/seznam/IMA.js-examples/tree/master/hello" target="_blank">Hello</a> example.
    </p>
  </div>
  <div class="column">
    <h3 class="title is-4">Routing</h3>
    <p>
      IMA.js comes with a built-in <a href="{{ '/doc/router/router-abstract-router.html' | relative_url }}">router</a> for processing GET and POST HTTP requests.
    </p>
  </div>
  <div class="column">
    <h3 class="title is-4">Bleeding Edge Technologies</h3>
    <p>
      ES2015 (JSX Harmony), Gulp, flo, Live Reaload and other <a href="#technologies">technologies</a>.
    </p>
  </div>
</div>
<h3 class="title has-text-centered">
  <span>...and more</span>
  <span class="icon">
    <i class="fas fa-caret-down"></i>
  </span>
</h3>
<ul class="has-text-centered">
  <li>
    <i class="fas fa-asterisk has-text-primary"></i>&nbsp;Application can be switched between <a href="https://github.com/seznam/IMA.js-examples/blob/master/hello/environment.js#L42-L52" target="_blank">IMA, SPA and MPA modes</a> or combine them.
  </li>
  <li>
    <i class="fas fa-asterisk has-text-primary"></i>&nbsp;<a href="https://github.com/seznam/IMA.js-examples/blob/master/hello/environment.js" target="_blank">Configuration</a> for all your environments in one place with inheritance.
  </li>
  <li>
    <i class="fas fa-asterisk has-text-primary"></i>&nbsp;Out-of-box <a href="https://github.com/seznam/IMA.js-examples/blob/master/hello/environment.js#L53-L65" target="_blank">configurable server-side caching</a>.
  </li>
  <li><i class="fas fa-asterisk has-text-primary"></i>&nbsp;Out-of-box REST API <a href="https://github.com/seznam/IMA.js-server/blob/master/lib/proxy.js" target="_blank">localhost proxy</a> with communication logging.</li>
  <li><i class="fas fa-asterisk has-text-primary"></i>&nbsp;<a href="https://github.com/seznam/IMA.js-examples/blob/master/hello/config/settings.js#L6-L20" target="_blank">REST API cache</a>.</li>
  <li><i class="fas fa-asterisk has-text-primary"></i>&nbsp;Advanced error handling for greater stability and faster development.</li>
  <li><i class="fas fa-asterisk has-text-primary"></i>&nbsp;High-fidelity debug mode.</li>
  <li><i class="fas fa-asterisk has-text-primary"></i>&nbsp;<a href="{{ '/doc/general/object-container.html' | relative_url }}">Dependency injection</a>.</li>
</ul>
<div class="level separator">
  <div class="level-item">
    <span class="fa-stack fa-2x">
      <i class="fas fa-circle fa-stack-2x has-text-primary"></i>
      <i class="far fa-newspaper fa-stack-1x has-text-white"></i>
    </span>
  </div>
</div>
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
<div class="level separator">
  <div class="level-item">
    <span class="fa-stack fa-2x">
      <i class="fas fa-circle fa-stack-2x has-text-primary"></i>
      <i class="fas fa-server fa-stack-1x has-text-white"></i>
    </span>
  </div>
</div>
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
<div class="level separator">
  <div class="level-item">
    <span class="fa-stack fa-2x">
      <i class="fas fa-circle fa-stack-2x has-text-primary"></i>
      <i class="fas fa-wrench fa-stack-1x has-text-white"></i>
    </span>
  </div>
</div>
<h2 class="title has-text-centered">Used Technologies</h2>
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
