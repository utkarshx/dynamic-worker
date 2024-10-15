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

export default templates;