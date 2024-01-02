(function(){'use strict';function h(a,d){n[a]="function"===typeof d?Object.defineProperty(d,"name",{value:a}):d};var r=class extends Error{constructor(a){super(a);this.name=this.constructor.name}},v=class extends r{constructor(a){super(a);this.stack=""}};var w=class{constructor(a,d){this.message=a;this.a=d}},x=class extends w{constructor(a,d){super(a,d)}},y=class{constructor(a){this.then=a.then.bind(a)}};function z(a){return a?`${"function"===typeof a?a():a}\n`:""};var n=window.GM_selenium||{};window.GM_selenium=n;h("Condition",w);h("ElementCondition",x);h("ElementPromise",y);
h("wait",function(a){function d(){return new Promise((c,e)=>{try{c(t(A))}catch(k){e(k)}})}let f=a.condition,A=a.input,g=a.timeout,l=a.pollTimeout,q=a.message;if("undefined"===typeof g)g=0;else if("number"!==typeof g||0>g)throw new TypeError("timeout must be a number >= 0: "+g);if("undefined"===typeof l)l=200;else if("number"!==typeof l||0>l)throw new TypeError("pollTimeout must be a number >= 0: "+l);if("[object Promise]"===Object.prototype.toString.call(f))return new Promise((c,e)=>{if(g){var k=
Date.now(),m=setTimeout(function(){m=null;try{let b=z(q);e(new v(`${b}Timed out waiting for promise to resolve after ${Date.now()-k}ms`))}catch(b){e(new v(`${b.message}\nTimed out waiting for promise to resolve after ${Date.now()-k}ms`))}},g),p=()=>m&&clearTimeout(m);f.then(function(b){p();c(b)},function(b){p();e(b)})}else c(f)});let t;if(f instanceof w)q=q||"Waiting "+f.message,t=f.a;else if("function"===typeof f)t=f;else throw new TypeError("Wait condition must be a promise-like object, function, or a Condition object");
a=new Promise((c,e)=>{const k=Date.now(),m=async()=>{d().then(function(p){const b=Date.now()-k;if(p)c(p);else if(g&&b>=g)try{let u=z(q);e(new v(`${u}Wait timed out after ${b}ms`))}catch(u){e(new v(`${u.message}\nWait timed out after ${b}ms`))}else setTimeout(m,l)},e)};m()});return f instanceof x?new y(a.then(function(c){if(!(c instanceof Element))throw new TypeError("ElementCondition did not resolve to a Element: "+Object.prototype.toString.call(c));return c})):a});h("TimeoutError",v);
h("WebDriverError",r);}).call(this);
//# sourceMappingURL=GM_selenium.js.map
