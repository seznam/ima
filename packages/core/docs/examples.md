---
---

{% include separator.html icon="fa-code" %}
<h1 class="title has-text-centered">Examples</h1>
<div id="examples">
  <div class="columns is-limited-width">
    {% for example in site.data.examples %}
      {% include example.html img=example.img tags=example.tags text=example.text title=example.title url=example.url %}
    {% endfor %}
  </div>
</div>
