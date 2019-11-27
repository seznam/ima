---
layout: "docs"
---

<div class="logo">
  <figure class="image is-padded">
    <img src="{{ '/img/imajs-logo.png?v=' | append: site.github.build_revision | relative_url }}" alt="IMA.js logo">
  </figure>
</div>

Welcome to the documentation of the IMA.js framework. If you've missed our 
tutorial, go ahead and [read it through](/tutorial/introduction.html). It's great to catch 
a glimpse of how to work with the application.

In the documentation you'll find an in depth look to every part of the IMA.js 
framework. If you're not searching for specific information or you're reeding
this for the first time, it's good to stick to the order of the pages. Many 
things refer to each other and we've tried to organize the page so you don't
have to jump from one to the other.

Also, a lot of features is emphasized in examples and notes below examples. 
Take some time and read them carefully.

----

## [Installation & Build](/docs/getting-started.html)

First you'll need to install the IMA.js framework and learn how
to run it in a development and production environment. This page will also 
introduce you to the application structure.

#### Jump to:
- [Overview](/docs/getting-started.html#overview)
- [Installation](/docs/getting-started.html#installation)
- [Application structure](/docs/getting-started.html#application-structure)
- [Production use](/docs/getting-started.html#production-use)

## [Configuration](/docs/configuration.html)

Overview of how to configure you application, build system and more. 
Configuration is a key feature you should comprehend before anything else 
because It lays a solid foundation for gaining next knowledge.

#### Jump to:
- [Build and environment configuration](/docs/configuration.html#build-and-environment-configuration)
- [Application configuration](/docs/configuration.html#application-configuration)

## [Object Container](/docs/object-container.html)

Registering things in Object Container is part of configuration but that's not 
everything the Object Container can do. Learn how to define you dependencies,
aliases, implementations and constants and how to retrieve them wherever you
need them.

#### Jump to:
- [Manually registering dependencies](/docs/object-container.html#manually-registering-dependencies)
- [Obtaining dependencies](/docs/object-container.html#obtaining-dependencies)

## [Routing](/docs/routing.html)

Routing is also part of the configuration topic but it deserves a separate 
page. On this page you'll learn how to set-up a router and how to create links 
to the routes you'll register.

#### Jump to:
- [Setting up Router](/docs/routing.html#setting-up-router)
- [Linking to routes](/docs/routing.html#linking-to-routes)

## [Page Manager](/docs/page-manager.html)

Page Manager is an essential part of IMA.js. It's something like a puppeteer that manipulates with pages and views. Once a router matches URL to one of route's path the page manager takes care of the rest.

#### Jump to:
- [Managing process](/docs/page-manager.html#managing-process)
- [Intervene into the process](/docs/page-manager.html#intervene-into-the-process)
    - [PageManagerHandlers](/docs/page-manager.html#pagemanagerhandlers)
- [Registering PageManagerHandlers](/docs/page-manager.html#registering-pagemanagerhandlers)
- [PageNavigationHandler](/docs/page-manager.html#pagenavigationhandler)

## [Page State & Controller](Page-State-%26-Controller)

Core of each application is the data the app is working with. **PageStateManager** provides state management during application run and takes care of distributing data to controller and its registered extensions.

### Jump to:
- [Get & Set](Page-State-%26-Controller#get-set)
- [Initial page state](Page-State-%26-Controller#initial-page-state)
- [Partial state](Page-State-%26-Controller#partial-state)

## [Controller lifecycle](/docs/controller-lifecycle.html)

Controller lifecycle page will tell you about a journey every 
controller goes on when a specific route activates. Understanding this will
make you a master of controlling your application and managing it's state. 
[SEO and MetaManager](/docs/seo-and-meta-manager.html) is an integral part of controllers so be sure to check out
that page too.

#### Jump to:
- [`init()`](/docs/controller-lifecycle.html#init-serverclient)
- [`load()`](/docs/controller-lifecycle.html#load-serverclient)
- [`setMetaParams()`](/docs/controller-lifecycle.html#setmetaparams-serverclient)
- [`activate()`](/docs/controller-lifecycle.html#activate-client)
- [`update()`](/docs/controller-lifecycle.html#update-client)
- [`deactivate()`](/docs/controller-lifecycle.html#deactivate-client)
- [`destroy()`](/docs/controller-lifecycle.html#destroy-client)

## [Extensions](/docs/extensions.html)

A small digression from the conventional MCV structure. Extensions are like 
controllers for components without a need to register them under a specific
route. They provide a lot of flexibility in managing the state and loading data.

#### Jump to:
- [Why use extensions](/docs/extensions.html#why-use-extensions)
- [How to use extensions](/docs/extensions.html#how-to-use-extensions)
- [Passing partial state from controllers](/docs/extensions.html#passing-partial-state-from-controllers)

## [Rendering process](/docs/rendering-process.html)

A detailed explanation of what where and why the IMA.js renders, how to perform 
tricks like persistent components or where to set the application context.
Learning the rendering process is a prerequisite before reading the 
[View & Components](/docs/views-and-components.html) page.

#### Jump to:
- [DocumentView](/docs/rendering-process.html#documentview)
- [ViewAdapter](/docs/rendering-process.html#viewadapter)
  - [React Context](/docs/rendering-process.html#react-context)
- [ManagedRootView](/docs/rendering-process.html#managedrootview)

## [View & Components](/docs/views-and-components.html)

Overview how the rendering process continues down to the smallest part of your
application. Learn what happens with the View when route changes and how to
organize your Views.

#### Jump to:
- [Organizing Views](/docs/views-and-components.html#organizing-views-and-components)
- [Rendering Views](/docs/views-and-components.html#rendering-views)
- [Communication between Views and Controllers](/docs/views-and-components.html#communication-between-views-and-controllers)
- [Utilities shared across Views and Components](/docs/views-and-components.html#utilities-shared-across-views-and-components)

## [EventBus, Dispatcher & Events](/docs/events.html)

EventBus and Dispatcher are great utilities that make working with events really
simple. This page also describes events used by IMA.js to communicate with your
application.

#### Jump to:
- [EventBus](/docs/events.html#eventbus)
- [Dispatcher](/docs/events.html#dispatcher)
- [Built-in events](/docs/events.html#built-in-events)

## [SEO & MetaManager](/docs/seo-and-meta-manager.html)

MetaManager is a handy tool to manage meta information that usually changes 
with every page. You don't have to pass meta information through the state or 
view variables. Handle your SEO like a PRO!

#### Jump to:
- [Setting and obtaining information from the MetaManager](/docs/seo-and-meta-manager.html#setting-and-obtaining-information-from-the-metamanager)
- [Automatically displaying all information](/docs/seo-and-meta-manager.html#automatically-displaying-all-information)

## [Dictionary (i18n & l10n)](/docs/dictionary.html)

Internationalisation and localisation in IMA.js with parameters replacement, pluralisation and other neat features according to ICU.

#### Jump to:
- [Configuration](/docs/dictionary.html#configuration)
- [Usage](/docs/dictionary.html#usage)
