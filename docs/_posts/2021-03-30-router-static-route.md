---
category: "router"
title: "API - StaticRoute"
menuTitle: "StaticRoute"
---

## Classes

<dl>
<dt><a href="#StaticRoute">StaticRoute</a> ⇐ <code>AbstractRoute</code></dt>
<dd><p>Utility for representing and manipulating a single static route in the
router&#39;s configuration using string representation of the path expression
with special param fields identified by <code>:paramName</code> prefix.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#CONTROL_CHARACTERS_REGEXP">CONTROL_CHARACTERS_REGEXP</a> : <code>RegExp</code></dt>
<dd><p>Regular expression matching all control characters used in regular
expressions. The regular expression is used to match these characters in
path expressions and replace them appropriately so the path expression can
be compiled to a regular expression.</p>
</dd>
<dt><a href="#PARAMS_REGEXP_UNIVERSAL">PARAMS_REGEXP_UNIVERSAL</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to match the parameter names from a path expression.</p>
</dd>
<dt><a href="#PARAMS_REGEXP_REQUIRED">PARAMS_REGEXP_REQUIRED</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to match the required parameter names from a path expression.</p>
</dd>
<dt><a href="#PARAMS_REGEXP_CORE_NAME">PARAMS_REGEXP_CORE_NAME</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to separate a camelCase parameter name</p>
</dd>
<dt><a href="#PARAMS_START_PATTERN">PARAMS_START_PATTERN</a> : <code>String</code></dt>
<dd><p>Regular expression used to match start of parameter names from a path expression.</p>
</dd>
<dt><a href="#PARAMS_END_PATTERN">PARAMS_END_PATTERN</a> : <code>String</code></dt>
<dd><p>Regular expression used to match end of parameter names from a path expression.</p>
</dd>
<dt><a href="#PARAMS_NEVER_MATCH_REGEXP">PARAMS_NEVER_MATCH_REGEXP</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to never match the parameter names from a path expression.
It&#39;s used for wrong parameters order (optional vs. required ones)</p>
</dd>
<dt><a href="#PARAMS_MAIN_REGEXP">PARAMS_MAIN_REGEXP</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to match all main parameter names from a path expression.</p>
</dd>
<dt><a href="#SUBPARAMS_REQUIRED_REGEXP">SUBPARAMS_REQUIRED_REGEXP</a> : <code>Object.&lt;String, RegExp&gt;</code></dt>
<dd><p>Regular expression used to match the required subparameter names from a path expression.
(e.g. for path &#39;/:paramA-:paramB/:nextParam&#39; are subparametres &#39;paramA&#39; and &#39;paramB&#39;)</p>
</dd>
<dt><a href="#SUBPARAMS_OPT_REGEXP">SUBPARAMS_OPT_REGEXP</a> : <code>Object.&lt;String, RegExp&gt;</code></dt>
<dd><p>Regular expression used to match the optional parameter names from a path expression.</p>
</dd>
<dt><a href="#PARAMS_REGEXP_OPT">PARAMS_REGEXP_OPT</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to match the parameter names from a path expression.</p>
</dd>
</dl>

## StaticRoute ⇐ <code>AbstractRoute</code>&nbsp;<a name="StaticRoute" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for representing and manipulating a single static route in the
router's configuration using string representation of the path expression
with special param fields identified by <code>:paramName</code> prefix.

**Kind**: global class  
**Extends**: <code>AbstractRoute</code>  

* [StaticRoute](#StaticRoute) ⇐ <code>AbstractRoute</code>
    * [new StaticRoute(pathExpression)](#new_StaticRoute_new)
    * [._trimmedPathExpression](#StaticRoute+_trimmedPathExpression) : <code>string</code>
    * [._parameterNames](#StaticRoute+_parameterNames) : <code>Array.&lt;string&gt;</code>
    * [._hasParameters](#StaticRoute+_hasParameters) : <code>boolean</code>
    * [._matcher](#StaticRoute+_matcher) : <code>RegExp</code>
    * [.toPath()](#StaticRoute+toPath)
    * [.matches()](#StaticRoute+matches)
    * [.extractParameters()](#StaticRoute+extractParameters)
    * [._substituteRequiredParamInPath(path, paramName, paramValue)](#StaticRoute+_substituteRequiredParamInPath) ⇒ <code>string</code>
    * [._substituteOptionalParamInPath(path, paramName, paramValue)](#StaticRoute+_substituteOptionalParamInPath) ⇒ <code>string</code>
    * [._cleanUnusedOptionalParams(path)](#StaticRoute+_cleanUnusedOptionalParams) ⇒ <code>string</code>
    * [._isOptionalParamInPath(path, paramName)](#StaticRoute+_isOptionalParamInPath) ⇒ <code>boolean</code>
    * [._isRequiredParamInPath(path, paramName)](#StaticRoute+_isRequiredParamInPath) ⇒ <code>boolean</code>
    * [._getClearParamName(rawParam)](#StaticRoute+_getClearParamName) ⇒ <code>string</code>
    * [._getSubparamPattern(delimeter)](#StaticRoute+_getSubparamPattern) ⇒ <code>string</code>
    * [._checkOptionalParamsOrder(allMainParams)](#StaticRoute+_checkOptionalParamsOrder) ⇒ <code>boolean</code>
    * [._checkParametersOrder(clearedPathExpr)](#StaticRoute+_checkParametersOrder) ⇒ <code>Bool</code>
    * [._replaceOptionalParametersInPath(path, optionalParams)](#StaticRoute+_replaceOptionalParametersInPath) ⇒ <code>string</code>
    * [._replaceRequiredSubParametersInPath(path, clearedPathExpr)](#StaticRoute+_replaceRequiredSubParametersInPath) ⇒ <code>string</code>
    * [._replaceOptionalSubParametersInPath(path, optionalSubparamsOthers, optionalSubparamsLast)](#StaticRoute+_replaceOptionalSubParametersInPath) ⇒ <code>string</code>
    * [._compileToRegExp(pathExpression)](#StaticRoute+_compileToRegExp) ⇒ <code>RegExp</code>
    * [._getParameters(path)](#StaticRoute+_getParameters) ⇒ <code>Object.&lt;string, string&gt;</code>
    * [._extractParameters(parameterValues)](#StaticRoute+_extractParameters) ⇒ <code>Object.&lt;string, ?string&gt;</code>
    * [._cleanOptParamName(paramName)](#StaticRoute+_cleanOptParamName) ⇒ <code>string</code>
    * [._isParamOptional(paramName)](#StaticRoute+_isParamOptional) ⇒ <code>boolean</code>
    * [._getParameterNames(pathExpression)](#StaticRoute+_getParameterNames) ⇒ <code>Array.&lt;string&gt;</code>


* * *

### new StaticRoute(pathExpression)&nbsp;<a name="new_StaticRoute_new"></a>

| Param | Type | Description |
| --- | --- | --- |
| pathExpression | <code>string</code> | A path expression specifying the URL path        part matching this route (must not contain a query string),        optionally containing named parameter placeholders specified as        <code>:parameterName</code>. |


* * *

### staticRoute.\_trimmedPathExpression : <code>string</code>&nbsp;<a name="StaticRoute+_trimmedPathExpression" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L125" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The path expression with the trailing slashes trimmed.

**Kind**: instance property of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.\_parameterNames : <code>Array.&lt;string&gt;</code>&nbsp;<a name="StaticRoute+_parameterNames" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L132" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The names of the parameters in this route.

**Kind**: instance property of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.\_hasParameters : <code>boolean</code>&nbsp;<a name="StaticRoute+_hasParameters" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L139" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Set to <code>true</code> if this route contains parameters in its path.

**Kind**: instance property of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.\_matcher : <code>RegExp</code>&nbsp;<a name="StaticRoute+_matcher" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L147" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
A regexp used to match URL path against this route and extract the
parameter values from the matched URL paths.

**Kind**: instance property of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.toPath()&nbsp;<a name="StaticRoute+toPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L153" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.matches()&nbsp;<a name="StaticRoute+matches" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L184" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.extractParameters()&nbsp;<a name="StaticRoute+extractParameters" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L193" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

* * *

### staticRoute.\_substituteRequiredParamInPath(path, paramName, paramValue) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_substituteRequiredParamInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L209" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Replace required parameter placeholder in path with parameter value.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - New path.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| paramName | <code>string</code> | 
| paramValue | <code>string</code> | 


* * *

### staticRoute.\_substituteOptionalParamInPath(path, paramName, paramValue) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_substituteOptionalParamInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L224" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Replace optional param placeholder in path with parameter value.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - New path.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| paramName | <code>string</code> | 
| paramValue | <code>string</code> | 


* * *

### staticRoute.\_cleanUnusedOptionalParams(path) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_cleanUnusedOptionalParams" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L238" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Remove unused optional param placeholders in path.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - New path.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 


* * *

### staticRoute.\_isOptionalParamInPath(path, paramName) ⇒ <code>boolean</code>&nbsp;<a name="StaticRoute+_isOptionalParamInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L260" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns true, if paramName is placed in path.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| paramName | <code>string</code> | 


* * *

### staticRoute.\_isRequiredParamInPath(path, paramName) ⇒ <code>boolean</code>&nbsp;<a name="StaticRoute+_isRequiredParamInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L273" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns true, if paramName is placed in path and it's required.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| paramName | <code>string</code> | 


* * *

### staticRoute.\_getClearParamName(rawParam) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_getClearParamName" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L285" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extract clear parameter name, e.q. '?name' or 'name'

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

| Param | Type |
| --- | --- |
| rawParam | <code>string</code> | 


* * *

### staticRoute.\_getSubparamPattern(delimeter) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_getSubparamPattern" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L299" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Get pattern for subparameter.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

| Param | Type | Description |
| --- | --- | --- |
| delimeter | <code>string</code> | Parameters delimeter |


* * *

### staticRoute.\_checkOptionalParamsOrder(allMainParams) ⇒ <code>boolean</code>&nbsp;<a name="StaticRoute+_checkOptionalParamsOrder" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L311" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Check if all optional params are below required ones

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  

| Param | Type |
| --- | --- |
| allMainParams | <code>array.&lt;string&gt;</code> | 


* * *

### staticRoute.\_checkParametersOrder(clearedPathExpr) ⇒ <code>Bool</code>&nbsp;<a name="StaticRoute+_checkParametersOrder" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L337" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Check if main parametres have correct order.
It means that required param cannot follow optional one.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>Bool</code> - Returns TRUE if order is correct.  

| Param | Type | Description |
| --- | --- | --- |
| clearedPathExpr | <code>string</code> | The cleared URL path (removed first and last slash, ...). |


* * *

### staticRoute.\_replaceOptionalParametersInPath(path, optionalParams) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_replaceOptionalParametersInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L356" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Convert main optional parameters to capture sequences

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - RegExp pattern.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path. |
| optionalParams | <code>array.&lt;string&gt;</code> | List of main optimal parameter expressions |


* * *

### staticRoute.\_replaceRequiredSubParametersInPath(path, clearedPathExpr) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_replaceRequiredSubParametersInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L388" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Convert required subparameters to capture sequences

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - RegExp pattern.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path (route definition). |
| clearedPathExpr | <code>string</code> | The original cleared URL path. |


* * *

### staticRoute.\_replaceOptionalSubParametersInPath(path, optionalSubparamsOthers, optionalSubparamsLast) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_replaceOptionalSubParametersInPath" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L421" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Convert optional subparameters to capture sequences

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - RegExp pattern.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path (route definition). |
| optionalSubparamsOthers | <code>array.&lt;string&gt;</code> | List of all subparam. expressions but last ones |
| optionalSubparamsLast | <code>array.&lt;string&gt;</code> | List of last subparam. expressions |


* * *

### staticRoute.\_compileToRegExp(pathExpression) ⇒ <code>RegExp</code>&nbsp;<a name="StaticRoute+_compileToRegExp" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L453" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Compiles the path expression to a regular expression that can be used
for easier matching of URL paths against this route, and extracting the
path parameter values from the URL path.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>RegExp</code> - The compiled regular expression.  

| Param | Type | Description |
| --- | --- | --- |
| pathExpression | <code>string</code> | The path expression to compile. |


* * *

### staticRoute.\_getParameters(path) ⇒ <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="StaticRoute+_getParameters" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L524" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Parses the provided path and extract the in-path parameters. The method
decodes the parameters and returns them in a hash object.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>Object.&lt;string, string&gt;</code> - The parsed path parameters.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path. |


* * *

### staticRoute.\_extractParameters(parameterValues) ⇒ <code>Object.&lt;string, ?string&gt;</code>&nbsp;<a name="StaticRoute+_extractParameters" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L545" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extract parameters from given path.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>Object.&lt;string, ?string&gt;</code> - Params object.  

| Param | Type |
| --- | --- |
| parameterValues | <code>Array.&lt;string&gt;</code> | 


* * *

### staticRoute.\_cleanOptParamName(paramName) ⇒ <code>string</code>&nbsp;<a name="StaticRoute+_cleanOptParamName" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L573" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns optional param name without "?"

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>string</code> - Strict param name without "?"  

| Param | Type | Description |
| --- | --- | --- |
| paramName | <code>string</code> | Full param name with "?" |


* * *

### staticRoute.\_isParamOptional(paramName) ⇒ <code>boolean</code>&nbsp;<a name="StaticRoute+_isParamOptional" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L583" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Checks if parameter is optional or not.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>boolean</code> - return true if is optional, otherwise false  

| Param | Type |
| --- | --- |
| paramName | <code>string</code> | 


* * *

### staticRoute.\_getParameterNames(pathExpression) ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="StaticRoute+_getParameterNames" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L594" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extracts the parameter names from the provided path expression.

**Kind**: instance method of [<code>StaticRoute</code>](#StaticRoute)  
**Returns**: <code>Array.&lt;string&gt;</code> - The names of the parameters defined in the provided
        path expression.  

| Param | Type | Description |
| --- | --- | --- |
| pathExpression | <code>string</code> | The path expression. |


* * *

## CONTROL\_CHARACTERS\_REGEXP : <code>RegExp</code>&nbsp;<a name="CONTROL_CHARACTERS_REGEXP" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L12" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression matching all control characters used in regular
expressions. The regular expression is used to match these characters in
path expressions and replace them appropriately so the path expression can
be compiled to a regular expression.

**Kind**: global constant  

* * *

## PARAMS\_REGEXP\_UNIVERSAL : <code>RegExp</code>&nbsp;<a name="PARAMS_REGEXP_UNIVERSAL" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L20" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match the parameter names from a path expression.

**Kind**: global constant  

* * *

## PARAMS\_REGEXP\_REQUIRED : <code>RegExp</code>&nbsp;<a name="PARAMS_REGEXP_REQUIRED" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L28" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match the required parameter names from a path expression.

**Kind**: global constant  

* * *

## PARAMS\_REGEXP\_CORE\_NAME : <code>RegExp</code>&nbsp;<a name="PARAMS_REGEXP_CORE_NAME" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L36" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to separate a camelCase parameter name

**Kind**: global constant  

* * *

## PARAMS\_START\_PATTERN : <code>String</code>&nbsp;<a name="PARAMS_START_PATTERN" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L44" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match start of parameter names from a path expression.

**Kind**: global constant  

* * *

## PARAMS\_END\_PATTERN : <code>String</code>&nbsp;<a name="PARAMS_END_PATTERN" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match end of parameter names from a path expression.

**Kind**: global constant  

* * *

## PARAMS\_NEVER\_MATCH\_REGEXP : <code>RegExp</code>&nbsp;<a name="PARAMS_NEVER_MATCH_REGEXP" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to never match the parameter names from a path expression.
It's used for wrong parameters order (optional vs. required ones)

**Kind**: global constant  

* * *

## PARAMS\_MAIN\_REGEXP : <code>RegExp</code>&nbsp;<a name="PARAMS_MAIN_REGEXP" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L69" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match all main parameter names from a path expression.

**Kind**: global constant  

* * *

## SUBPARAMS\_REQUIRED\_REGEXP : <code>Object.&lt;String, RegExp&gt;</code>&nbsp;<a name="SUBPARAMS_REQUIRED_REGEXP" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L78" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match the required subparameter names from a path expression.
(e.g. for path '/:paramA-:paramB/:nextParam' are subparametres 'paramA' and 'paramB')

**Kind**: global constant  

* * *

## SUBPARAMS\_OPT\_REGEXP : <code>Object.&lt;String, RegExp&gt;</code>&nbsp;<a name="SUBPARAMS_OPT_REGEXP" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L89" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match the optional parameter names from a path expression.

**Kind**: global constant  

* * *

## PARAMS\_REGEXP\_OPT : <code>RegExp</code>&nbsp;<a name="PARAMS_REGEXP_OPT" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/router/StaticRoute.js#L100" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match the parameter names from a path expression.

**Kind**: global constant  

* * *

