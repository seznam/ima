---
layout: "docs"
title: "Docs"
---

<div class="logo">
  <figure class="image is-padded">
    <img src="{{ '/img/imajs-logo.png?v=' | append: site.github.build_revision | relative_url }}" alt="IMA.js logo">
  </figure>
</div>

Welcome to the documentation of the IMA.js framework. If you've missed our 
tutorial, go ahead and [read it through](/tutorial/introduction). It's great to catch 
a glimpse of how to work with the application.

In the documentation you'll find an in depth look to every part of the IMA.js 
framework. If you're not searching for specific information or you're reeding
this for the first time, it's good to stick to the order of the pages. Many 
things refer to each other and we've tried to organize the page so you don't
have to jump from one to the other.

Also, a lot of features is emphasized in examples and notes below examples. 
Take some time and read them carefully.
 
In case you want to dig right into the interface of each class and component,
[take a look at the API](/api).

----

## [Installation & Build](/docs/getting-started)

First you'll need to install the IMA.js framework and learn how
to run it in a development and production environment. This page will also 
introduce you to the application structure.

#### Jump to:
- [Overview](/docs/getting-started#overview)
- [Installation](/docs/getting-started#installation)
- [Application structure](/docs/getting-started#application-structure)
- [Production use](/docs/getting-started#production-use)

## [Configuration](/docs/configuration)

Overview of how to configure you application, build system and more. 
Configuration is a key feature you should comprehend before anything else 
because It lays a solid foundation for gaining next knowledge.

#### Jump to:
- [Build and environment configuration](/docs/configuration#build-and-environment-configuration)
- [Application configuration](/docs/configuration#application-configuration)

## [Object Container](/docs/object-container)

Registering things in Object Container is part of configuration but that's not 
everything the Object Container can do. Learn how to define you dependencies,
aliases, implementations and constants and how to retrieve them wherever you
need them.

#### Jump to:
- [Manually registering dependencies](/docs/object-container#manually-registering-dependencies)
- [Obtaining dependencies](/docs/object-container#obtaining-dependencies)

## [Routing](/docs/routing)

Routing is also part of the configuration topic but it deserves a separate 
page. On this page you'll learn how to set-up a router and how to create links 
to the routes you'll register.

#### Jump to:
- [Setting up Router](/docs/routing#setting-up-router)
- [Linking to routes](/docs/routing#linking-to-routes)
- [Dynamic routes](/docs/routing#dynamic-routes)

## [Page Manager](/docs/page-manager)

Page Manager is an essential part of IMA.js. It's something like a puppeteer that manipulates with pages and views. Once a router matches URL to one of route's path the page manager takes care of the rest.

#### Jump to:
- [Managing process](/docs/page-manager#managing-process)
- [Intervene into the process](/docs/page-manager#intervene-into-the-process)
    - [PageManagerHandlers](/docs/page-manager#pagemanagerhandlers)
- [Registering PageManagerHandlers](/docs/page-manager#registering-pagemanagerhandlers)
- [PageNavigationHandler](/docs/page-manager#pagenavigationhandler)
- [State transactions](/docs/page-manager#state-transactions)

## [Page State & Controller](/docs/page-state)

Core of each application is the data the app is working with. **PageStateManager** provides state management during application run and takes care of distributing data to controller and its registered extensions.

### Jump to:
- [Get & Set](/docs/page-state#get-set)
- [Initial page state](/docs/page-state#initial-page-state)
- [Partial state](/docs/page-state#partial-state)

## [Controller lifecycle](/docs/controller-lifecycle)

Controller lifecycle page will tell you about a journey every 
controller goes on when a specific route activates. Understanding this will
make you a master of controlling your application and managing it's state. 
[SEO and MetaManager](/docs/seo-and-meta-manager) is an integral part of controllers so be sure to check out
that page too.

#### Jump to:
- [`init()`](/docs/controller-lifecycle#init-serverclient)
- [`load()`](/docs/controller-lifecycle#load-serverclient)
- [`setMetaParams()`](/docs/controller-lifecycle#setmetaparams-serverclient)
- [`activate()`](/docs/controller-lifecycle#activate-client)
- [`update()`](/docs/controller-lifecycle#update-client)
- [`deactivate()`](/docs/controller-lifecycle#deactivate-client)
- [`destroy()`](/docs/controller-lifecycle#destroy-client)

## [Extensions](/docs/extensions)

A small digression from the conventional MCV structure. Extensions are like 
controllers for components without a need to register them under a specific
route. They provide a lot of flexibility in managing the state and loading data.

#### Jump to:
- [Why use extensions](/docs/extensions#why-use-extensions)
- [How to use extensions](/docs/extensions#how-to-use-extensions)
- [Passing partial state from controllers](/docs/extensions#passing-partial-state-from-controllers)

## [Rendering process](/docs/rendering-process)

A detailed explanation of what where and why the IMA.js renders, how to perform 
tricks like persistent components or where to set the application context.
Learning the rendering process is a prerequisite before reading the 
[View & Components](/docs/views-and-components) page.

#### Jump to:
- [DocumentView](/docs/rendering-process#documentview)
- [ViewAdapter](/docs/rendering-process#viewadapter)
  - [React Context](/docs/rendering-process#react-context)
- [ManagedRootView](/docs/rendering-process#managedrootview)

## [View & Components](/docs/views-and-components)

Overview how the rendering process continues down to the smallest part of your
application. Learn what happens with the View when route changes and how to
organize your Views.

#### Jump to:
- [Organizing Views](/docs/views-and-components#organizing-views-and-components)
- [Rendering Views](/docs/views-and-components#rendering-views)
- [Communication between Views and Controllers](/docs/views-and-components#communication-between-views-and-controllers)
- [Utilities shared across Views and Components](/docs/views-and-components#utilities-shared-across-views-and-components)

## [EventBus, Dispatcher & Events](/docs/events)

EventBus and Dispatcher are great utilities that make working with events really
simple. This page also describes events used by IMA.js to communicate with your
application.

#### Jump to:
- [EventBus](/docs/events#eventbus)
- [Dispatcher](/docs/events#dispatcher)
- [Built-in events](/docs/events#built-in-events)

## [SEO & MetaManager](/docs/seo-and-meta-manager)

MetaManager is a handy tool to manage meta information that usually changes 
with every page. You don't have to pass meta information through the state or 
view variables. Handle your SEO like a PRO!

#### Jump to:
- [Setting and obtaining information from the MetaManager](/docs/seo-and-meta-manager#setting-and-obtaining-information-from-the-metamanager)
- [Automatically displaying all information](/docs/seo-and-meta-manager#automatically-displaying-all-information)

## [Dictionary (i18n & l10n)](/docs/dictionary)

Internationalisation and localisation in IMA.js with parameters replacement, pluralisation and other neat features according to ICU.

#### Jump to:
- [Configuration](/docs/dictionary#configuration)
- [Usage](/docs/dictionary#usage)
