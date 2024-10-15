const templates = {};

//------------- START "indexTemplate.html" -------------
templates["indexTemplate"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "imports")), env.opts.autoescape);
output += "\n\nconst nodes = [";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.contextOrFrameLookup(context, frame, "nodesArray")), env.opts.autoescape);
output += "];\n\naddEventListener('fetch', event => {\n    event.respondWith(handleRequest(event.request));\n});\n\nasync function handleRequest(request) {\n    const results = [];\n\n    for (const nodeFunction of nodes) {\n        const result = await nodeFunction();\n        results.push(result);\n    }\n\n    return new Response(results.join('\\\\n'), { status: 200 });\n}";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
//------------- END "indexTemplate.html" -------------

//------------- START "package.json.html" -------------
templates["package.json"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "{\n    \"name\": \"dynamiccloudflare\",\n    \"version\": \"1.0.0\",\n    \"main\": \"dist/worker.js\",\n    \"scripts\": {\n      \"dev\": \"npm run generate && npm run build && wrangler dev dist/worker.js\",\n      \"generate\": \"node src/index.js\",\n      \"start-server\": \"npm run compile-template && node src/main.js\",\n      \"build\": \"rollup -c\",\n      \"compile-template\": \"npx hono-nunjucks-precompile src/templates/raw src/templates/precompiled.mjs\"\n    },\n    \"keywords\": [],\n    \"author\": \"\",\n    \"license\": \"ISC\",\n    \"description\": \"\",\n    \"devDependencies\": {\n      \"@rollup/plugin-commonjs\": \"^28.0.0\",\n      \"@rollup/plugin-dynamic-import-vars\": \"^2.1.3\",\n      \"@rollup/plugin-node-resolve\": \"^15.3.0\",\n      \"@rollup/plugin-terser\": \"^0.4.4\",\n      \"rollup\": \"^4.24.0\",\n      \"rollup-plugin-glob-import\": \"^0.5.0\"\n    },\n    \"dependencies\": {\n      \"wrangler\": \"^3.80.4\"\n    }\n  }\n  ";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
//------------- END "package.json.html" -------------

//------------- START "rollup.config.js.html" -------------
templates["rollup.config.js"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "import resolve from '@rollup/plugin-node-resolve';\nimport commonjs from '@rollup/plugin-commonjs';\nimport terser from '@rollup/plugin-terser';\n\nexport default {\n    input: 'index.js',\n    output: {\n        file: 'dist/worker.js',\n        format: 'es',\n    },\n    plugins: [\n        resolve({\n            browser: true, // Resolve for browser environment\n            preferBuiltins: false, // Do not prefer Node.js built-ins\n        }),\n        commonjs(), // Convert CommonJS modules to ES6\n        terser(), // Minify the output\n    ],\n};";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
//------------- END "rollup.config.js.html" -------------

export default templates;