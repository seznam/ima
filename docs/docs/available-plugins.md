---
layout: "docs"
---

We've already described a way to [create your own IMA.js plugins](/docs/creating-custom-plugin.html)
through very simple interface. Now we would like to talk about [IMA.js-plugins](https://github.com/seznam/IMA.js-plugins)
monorepo that already **contains variety of plugins** that covers many of the common use cases.

Each plugin in this repository is thoroughly tested and maintained, so it always works
with the most up to date IMA.js version. We, here at [Seznam.cz](https://www.seznam.cz/)
use it daily in production on many of our projects, so don't worry about using them safely in the production
environment. 

Without further ado, let's quickly describe in this compact list 
**what each plugin does and when you would want to use them**:

## IMA.js-plugins

<ul>
  {% for plugin in site.data.plugins %}
    {% include plugin-item.html name=plugin.name url=plugin.url description=plugin.description %}
  {% endfor %}
</ul>
