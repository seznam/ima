---
title: New documentation website
description: New IMA.js documentation website based on docusaurus2.
slug: new-documentation
authors: [jan.simecek]
tags: [documentation, api, release]
hide_table_of_contents: false
---

We have released a **new documentation website **which uses docusaurus framework behind the curtain.

Using **docusaurus** allows us to focus more on the contents of the documentation rather than maintaining the websites source code. It also comes with some nice features out of the box, that will hopefully make browsing

<!--truncate-->

## New features

You should still be able to found the same content as on the old website, plus a lot more. Same as before, the website is structured into following main pages:

 - [Docs](/introduction/getting-started) - Main documentation, wich multiple sub-sections covering a lot of topics about our framework.
 - [Tutorial](/tutorial/introduction) - Basic tutorial, should be a first place you go to when using this framework for the first time.
 - [API](/api/modules) - Auto-generated documentation from source-code docstrings. We are using **Typedoc** in this case which should produce more useful API documentation than before.
 - [Blog](/blog) - A blog, just as any other blog. This is a new thing we're trying and we'll see how it goes.

### Visual elements

Components like **callouts** and much better **code highlighting** allows us to make the documentation more readable and useful.

We try to make use of these in a form of **tips** in almost any section. These usually mention situations where and how certain feature can be used to improve your experience with the framework.

### Search

**We finally have a fulltext search!** (thanks to the [algolia docsearch](https://docsearch.algolia.com/)) This should make finding stuff a lot easier than before (which was mostly impossible). Thanks to docusarus, all pages have a better SEO handling by default, which should also make them more visible in search engines.

### Still work in progress

There's still a lot of work before us and the website (especially it's contents) are still in very early stages. This means that there might still be some sections that are incomplete/not-updated, but we will do our best to slowly, incrementally, update the documentation so it is able to answer all your questions about our framework.
