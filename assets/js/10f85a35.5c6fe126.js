"use strict";(self.webpackChunk_ima_docs=self.webpackChunk_ima_docs||[]).push([[4513],{3905:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>u});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var o=n.createContext({}),m=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},d=function(e){var t=m(e.components);return n.createElement(o.Provider,{value:t},e.children)},s="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},k=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,o=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),s=m(a),k=i,u=s["".concat(o,".").concat(k)]||s[k]||c[k]||r;return a?n.createElement(u,l(l({ref:t},d),{},{components:a})):n.createElement(u,l({ref:t},d))}));function u(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,l=new Array(r);l[0]=k;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p[s]="string"==typeof e?e:i,l[1]=p;for(var m=2;m<r;m++)l[m]=a[m];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}k.displayName="MDXCreateElement"},3547:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>c,frontMatter:()=>r,metadata:()=>p,toc:()=>m});var n=a(5773),i=(a(7294),a(3905));const r={id:"ima_cli.ImaCliPlugin",title:"Interface: ImaCliPlugin",sidebar_label:"@ima/cli.ImaCliPlugin",custom_edit_url:null},l=void 0,p={unversionedId:"api/interfaces/ima_cli.ImaCliPlugin",id:"api/interfaces/ima_cli.ImaCliPlugin",title:"Interface: ImaCliPlugin",description:"@ima/cli.ImaCliPlugin",source:"@site/../docs/api/interfaces/ima_cli.ImaCliPlugin.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/ima_cli.ImaCliPlugin",permalink:"/api/interfaces/ima_cli.ImaCliPlugin",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"ima_cli.ImaCliPlugin",title:"Interface: ImaCliPlugin",sidebar_label:"@ima/cli.ImaCliPlugin",custom_edit_url:null},sidebar:"api",previous:{title:"@ima/cli.ImaCliArgs",permalink:"/api/interfaces/ima_cli.ImaCliArgs"},next:{title:"@ima/cli.ImaConfigurationContext",permalink:"/api/interfaces/ima_cli.ImaConfigurationContext"}},o={},m=[{value:"Properties",id:"properties",level:2},{value:"cliArgs",id:"cliargs",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"name",id:"name",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"Methods",id:"methods",level:2},{value:"postProcess",id:"postprocess",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Defined in",id:"defined-in-2",level:4},{value:"preProcess",id:"preprocess",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Defined in",id:"defined-in-3",level:4},{value:"prepareConfigurations",id:"prepareconfigurations",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-2",level:4},{value:"Defined in",id:"defined-in-4",level:4},{value:"webpack",id:"webpack",level:3},{value:"Parameters",id:"parameters-3",level:4},{value:"Returns",id:"returns-3",level:4},{value:"Defined in",id:"defined-in-5",level:4}],d={toc:m},s="wrapper";function c(e){let{components:t,...a}=e;return(0,i.kt)(s,(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/api/modules/ima_cli"},"@ima/cli"),".ImaCliPlugin"),(0,i.kt)("p",null,"Interface for ima/cli plugins that can be defined in plugins field in ima.conf.js. These can be used\nto extend functionality of default CLI with custom cli arguments and webpack config overrides."),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("h3",{id:"cliargs"},"cliArgs"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,i.kt)("inlineCode",{parentName:"p"},"Readonly")," ",(0,i.kt)("strong",{parentName:"p"},"cliArgs"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"Partial"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"Record"),"<",(0,i.kt)("a",{parentName:"p",href:"/api/modules/ima_cli#imaclicommand"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaCliCommand")),", ",(0,i.kt)("inlineCode",{parentName:"p"},"CommandBuilder"),">",">"),(0,i.kt)("p",null,"Optional additional CLI arguments to extend the set of existing ones."),(0,i.kt)("h4",{id:"defined-in"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/seznam/ima/blob/ad746c7/packages/cli/src/types.ts#L96"},"types.ts:96")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"name"},"name"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("inlineCode",{parentName:"p"},"Readonly")," ",(0,i.kt)("strong",{parentName:"p"},"name"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"string")),(0,i.kt)("p",null,"Plugin name, used mainly for better debugging messages."),(0,i.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/seznam/ima/blob/ad746c7/packages/cli/src/types.ts#L91"},"types.ts:91")),(0,i.kt)("h2",{id:"methods"},"Methods"),(0,i.kt)("h3",{id:"postprocess"},"postProcess"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,i.kt)("strong",{parentName:"p"},"postProcess"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"args"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"imaConfig"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"void"),">"),(0,i.kt)("p",null,"Optional plugin hook to do some custom processing after the compilation has finished.\nAttention! This hook runs only for build command."),(0,i.kt)("h4",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"args")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/interfaces/ima_cli.ImaCliArgs"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaCliArgs")))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"imaConfig")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/modules/ima_cli#imaconfig"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfig")))))),(0,i.kt)("h4",{id:"returns"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"void"),">"),(0,i.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/seznam/ima/blob/ad746c7/packages/cli/src/types.ts#L129"},"types.ts:129")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"preprocess"},"preProcess"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,i.kt)("strong",{parentName:"p"},"preProcess"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"args"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"imaConfig"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"void"),">"),(0,i.kt)("p",null,"Optional plugin hook to do some pre processing right after the cli args are processed\nand the imaConfig is loaded, before the webpack config creation and compiler run."),(0,i.kt)("h4",{id:"parameters-1"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"args")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/interfaces/ima_cli.ImaCliArgs"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaCliArgs")))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"imaConfig")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/modules/ima_cli#imaconfig"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfig")))))),(0,i.kt)("h4",{id:"returns-1"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"void"),">"),(0,i.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/seznam/ima/blob/ad746c7/packages/cli/src/types.ts#L102"},"types.ts:102")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"prepareconfigurations"},"prepareConfigurations"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,i.kt)("strong",{parentName:"p"},"prepareConfigurations"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"configurations"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"imaConfig"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"args"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("a",{parentName:"p",href:"/api/interfaces/ima_cli.ImaConfigurationContext"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfigurationContext")),"[]",">"),(0,i.kt)("p",null,"Called right before creating webpack configurations after preProcess call.\nThis hook lets you customize configuration contexts for each webpack config\nthat will be generated. This is usefull when you need to overrite configuration\ncontexts for values that are not editable anywhere else (like output folders)."),(0,i.kt)("h4",{id:"parameters-2"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"configurations")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/interfaces/ima_cli.ImaConfigurationContext"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfigurationContext")),"[]")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"imaConfig")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/modules/ima_cli#imaconfig"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfig")))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"args")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/interfaces/ima_cli.ImaCliArgs"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaCliArgs")))))),(0,i.kt)("h4",{id:"returns-2"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("a",{parentName:"p",href:"/api/interfaces/ima_cli.ImaConfigurationContext"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfigurationContext")),"[]",">"),(0,i.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/seznam/ima/blob/ad746c7/packages/cli/src/types.ts#L110"},"types.ts:110")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"webpack"},"webpack"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,i.kt)("strong",{parentName:"p"},"webpack"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"config"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"ctx"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"imaConfig"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"Configuration"),">"),(0,i.kt)("p",null,"Webpack callback function used by plugins to customize/extend ima webpack config before it's run."),(0,i.kt)("h4",{id:"parameters-3"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"config")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"Configuration"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"ctx")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/interfaces/ima_cli.ImaConfigurationContext"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfigurationContext")))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"imaConfig")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/api/modules/ima_cli#imaconfig"},(0,i.kt)("inlineCode",{parentName:"a"},"ImaConfig")))))),(0,i.kt)("h4",{id:"returns-3"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"Configuration"),">"),(0,i.kt)("h4",{id:"defined-in-5"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/seznam/ima/blob/ad746c7/packages/cli/src/types.ts#L119"},"types.ts:119")))}c.isMDXComponent=!0}}]);