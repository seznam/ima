"use strict";(self.webpackChunk_ima_docs=self.webpackChunk_ima_docs||[]).push([[9470],{7545:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/diagram-view-56a22b0e13633a1269dc52d3e1132aa6.png"},3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),u=r,h=d["".concat(l,".").concat(u)]||d[u]||m[u]||i;return n?a.createElement(h,o(o({ref:t},c),{},{components:n})):a.createElement(h,o({ref:t},c))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,o[1]=s;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5286:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var a=n(5773),r=(n(7294),n(3905));const i={title:"Views & Components",description:"Basic features > Views & Components"},o=void 0,s={unversionedId:"basic-features/views-and-components",id:"basic-features/views-and-components",title:"Views & Components",description:"Basic features > Views & Components",source:"@site/../docs/basic-features/views-and-components.md",sourceDirName:"basic-features",slug:"/basic-features/views-and-components",permalink:"/basic-features/views-and-components",draft:!1,editUrl:"https://github.com/seznam/ima/tree/master/docs/../docs/basic-features/views-and-components.md",tags:[],version:"current",lastUpdatedBy:"Jan \u0160ime\u010dek",lastUpdatedAt:1708621208,formattedLastUpdatedAt:"Feb 22, 2024",frontMatter:{title:"Views & Components",description:"Basic features > Views & Components"},sidebar:"docs",previous:{title:"Controller lifecycle",permalink:"/basic-features/controller-lifecycle"},next:{title:"Data fetching",permalink:"/basic-features/data-fetching"}},l={},p=[{value:"Organizing Views and Components",id:"organizing-views-and-components",level:2},{value:"Rendering Views",id:"rendering-views",level:2},{value:"Route parameters in View",id:"route-parameters-in-view",level:3},{value:"Communication between Views and Controllers",id:"communication-between-views-and-controllers",level:2},{value:"Utilities shared across Views and Components",id:"utilities-shared-across-views-and-components",level:2}],c={toc:p},d="wrapper";function m(e){let{components:t,...i}=e;return(0,r.kt)(d,(0,a.Z)({},c,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"As you may have noticed when a ",(0,r.kt)("a",{parentName:"p",href:"/basic-features/routing/introduction"},"route is registered"),",\na constructor of ",(0,r.kt)("strong",{parentName:"p"},"Controller")," and ",(0,r.kt)("strong",{parentName:"p"},"View")," is given as a 3rd and 4th argument.\nController takes care of loading and managing the data while View is a\npresentation for the data loaded by the Controller."),(0,r.kt)("p",null,(0,r.kt)("img",{src:n(7545).Z,width:"881",height:"421"})),(0,r.kt)("h2",{id:"organizing-views-and-components"},"Organizing Views and Components"),(0,r.kt)("p",null,"A good spot to place a view file is next to a controller file - that is:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"app/page/<name-of-the-page>/\n \u251c\u2500 SomeController.js\n \u251c\u2500 SomeView.jsx\n \u2514\u2500 someView.less\n")),(0,r.kt)("p",null,"To structure your views easily you can split your views into a smaller components\nthat can also be reused in other views. Those smaller component are then included\nand used as any other react component. Components should be\nplaced into a ",(0,r.kt)("inlineCode",{parentName:"p"},"app/component/")," directory."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"app/page/component/\n \u251c\u2500 document/\n |   \u2514\u2500 DocumentView.jsx\n \u251c\u2500 header/\n |   \u251c\u2500 Header.jsx\n |   \u2514\u2500 header.less\n \u2514\u2500 searchBar/\n     \u251c\u2500 SearchBar.jsx\n     \u2514\u2500 searchBar.less\n")),(0,r.kt)("h2",{id:"rendering-views"},"Rendering Views"),(0,r.kt)("p",null,"Views are just a React components that receive page state as props, that means you\ncan freely use internal component state and any React lifecycle methods as you\nwish."),(0,r.kt)("p",null,"An element that is returned from the ",(0,r.kt)("inlineCode",{parentName:"p"},"render")," method is appended to the\n",(0,r.kt)("inlineCode",{parentName:"p"},"ManagedRootView"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"ViewAdapter")," and then ",(0,r.kt)("inlineCode",{parentName:"p"},"DocumentView")," on the ",(0,r.kt)("strong",{parentName:"p"},"server side"),"\nand send as a plain HTML markup to the client where it's hydrated with it's\nformer state."),(0,r.kt)("p",null,"When a route change occurs on a ",(0,r.kt)("strong",{parentName:"p"},"client side")," and..."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"...only route parameters has changed, route was registered with the ",(0,r.kt)("inlineCode",{parentName:"li"},"onlyUpdate"),"\nflag set to ",(0,r.kt)("inlineCode",{parentName:"li"},"true")," and Controller has ",(0,r.kt)("inlineCode",{parentName:"li"},"update")," method defined. In this case the\nView receives new props (page state) and should react to them accordingly."),(0,r.kt)("li",{parentName:"ul"},"...the current view is different from the new one then the rendered view is\nreplaced with a newly rendered view.")),(0,r.kt)("h3",{id:"route-parameters-in-view"},"Route parameters in View"),(0,r.kt)("p",null,"In ideal case Views should only display data loaded in Controller and not even\ncare about route parameters. But as nothing is ever ideal we've added ",(0,r.kt)("a",{parentName:"p",href:"/basic-features/routing/introduction#route-params-substitutions"},(0,r.kt)("inlineCode",{parentName:"a"},"params")," object")," to the View props for you."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"// app/config/routes.js\nrouter.add('user-detail', '/user/:userId', UserController, UserView);\nrouter.add('user-edit', '/user/:userId/edit', UserEditController, UserEditView);\n\n// app/page/user-detail/UserView.jsx\nconst { userId } = this.props.params;\n\nconst userLink = this.link('user-edit', { userId });\n<a href = { userLink }>\n")),(0,r.kt)("p",null,"This example ensures that the link to ",(0,r.kt)("inlineCode",{parentName:"p"},"user-edit")," page is functional\nimmediately when a user navigates to ",(0,r.kt)("inlineCode",{parentName:"p"},"user-detail")," page. Otherwise the link would\nbe functional only after the user-loading promise has been resolved."),(0,r.kt)("h2",{id:"communication-between-views-and-controllers"},"Communication between Views and Controllers"),(0,r.kt)("p",null,"It's clear that data obtained in a Controller are passed down to a View and thus\naffecting how the rendered View looks and what it displays. A problem arises when\na View wants to tell Controller to load or change something. The solution to this\nare event handling utils ",(0,r.kt)("a",{parentName:"p",href:"./events#eventbus"},(0,r.kt)("strong",{parentName:"a"},"EventBus"))," and\n",(0,r.kt)("a",{parentName:"p",href:"./events#dispatcher"},(0,r.kt)("strong",{parentName:"a"},"Dispatcher")),"."),(0,r.kt)("h2",{id:"utilities-shared-across-views-and-components"},"Utilities shared across Views and Components"),(0,r.kt)("p",null,"At some point you'll come to a situation when it'd be nice to have a function or set of functions shared between multiple components. Great example would be custom link generation, page elements manipulation (modal, lightbox) or adverts and analytics."),(0,r.kt)("p",null,"These cases are covered by ",(0,r.kt)("strong",{parentName:"p"},"ComponentUtils")," that allow you to register classes (utilities) that are then shared across every View and Component. Utilities are instantiated through ",(0,r.kt)("a",{parentName:"p",href:"./object-container"},"OC")," therefore you can get access to other utilities or IMA.js components."),(0,r.kt)("p",null,"Example Utility class would look like this. Simple class with ",(0,r.kt)("a",{parentName:"p",href:"./object-container#1-dependency-injection"},"dependency injection"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// app/helper/LightboxHelper.js\nimport { Router } from '@ima/core';\n\nexport default class LightboxHelper {\n  static get $dependencies() {\n    return [Router];\n  }\n\n  showLightbox(content) {\n    ...\n  }\n}\n")),(0,r.kt)("p",null,"Then to register the utility class:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// app/config/bind.js\nimport { ComponentUtils } from '@ima/core';\nimport LightboxHelper from 'app/helper/LightboxHelper';\nimport AnalyticsUtils from 'app/helper/AnalyticsUtils';\n\nexport default (ns, oc, config) => {\n  const ComponentUtils = oc.get(ComponentUtils); // or oc.get('$ComponentUtils');\n\n  ComponentUtils.register('Lightbox', LightboxHelper);\n  // OR to register multiple utilities at once\n  ComponentUtils.register({\n    Lightbox: LightboxHelper,\n    AnalyticsUtils\n  });\n};\n")),(0,r.kt)("p",null,"Finally, what'd be the point to register these classes if we were not to use them... All of the utilities are present in ",(0,r.kt)("inlineCode",{parentName:"p"},"utils")," property on ",(0,r.kt)("strong",{parentName:"p"},"AbstractComponent"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// app/component/gallery/Gallery.jsx\nimport { AbstractComponent } from '@ima/react-page-renderer';\n\nexport default class Gallery extends AbstractComponent {\n\n  onPhotoClick(photoId) {\n    const { Lightbox } = this.utils;\n\n    Lightbox.showLightbox(...);\n  }\n}\n")),(0,r.kt)("p",null,"For some heavy-used utilities we've created a shortcut methods in ",(0,r.kt)("strong",{parentName:"p"},"AbstractComponent"),"."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"link")),(0,r.kt)("inlineCode",{parentName:"li"},"(name, params)")," = ",(0,r.kt)("a",{parentName:"li",href:"./routing/introduction#linking-between-routes"},(0,r.kt)("strong",{parentName:"a"},"Router.link()"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"localize")),(0,r.kt)("inlineCode",{parentName:"li"},"(key, params")," = ",(0,r.kt)("a",{parentName:"li",href:"./dictionary"},(0,r.kt)("strong",{parentName:"a"},"Dictionary.get()"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"fire")),(0,r.kt)("inlineCode",{parentName:"li"},"(eventName, data)")," = ",(0,r.kt)("a",{parentName:"li",href:"./events#eventbus"},(0,r.kt)("strong",{parentName:"a"},"EventBus.fire()"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"listen")),(0,r.kt)("inlineCode",{parentName:"li"},"(eventTarget, eventName, listener)")," = ",(0,r.kt)("a",{parentName:"li",href:"./events#eventbus"},(0,r.kt)("strong",{parentName:"a"},"EventBus.listen()"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"unlisten")),(0,r.kt)("inlineCode",{parentName:"li"},"(eventTarget, eventName, listener)")," = ",(0,r.kt)("a",{parentName:"li",href:"./events#eventbus"},(0,r.kt)("strong",{parentName:"a"},"EventBus.unlisten()")))),(0,r.kt)("p",null,"One special case would be ",(0,r.kt)("inlineCode",{parentName:"p"},"cssClasses")," shortcut which is by default alias for ",(0,r.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/classnames"},(0,r.kt)("strong",{parentName:"a"},"classnames"))," package. You can overwrite this behavior by registering you own helper in ComponentUtils under ",(0,r.kt)("inlineCode",{parentName:"p"},"$CssClasses")," alias."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"cssClasses")),(0,r.kt)("inlineCode",{parentName:"li"},"(classRules, includeComponentClassName")," = ",(0,r.kt)("inlineCode",{parentName:"li"},"this.utils.$CssClasses()"))))}m.isMDXComponent=!0}}]);