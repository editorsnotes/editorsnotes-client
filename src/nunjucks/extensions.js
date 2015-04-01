module.exports = {
  URL: function (router) {
    var KWARG_ERR = 'Cannot mix named and positional arguments.';

    function parseArgs(args) {
      var ret
        , isKwargs

      isKwargs = args.length && typeof args[0] === 'object';
      ret = isKwargs ? {} : [];

      args.forEach(function (arg) {
        if (typeof arg === 'object') {
          if (!isKwargs) throw new Error(KWARG_ERR);
          Object.keys(arg).forEach(function (key) {
            if (key === '__keywords') return;
            ret[key] = arg[key];
          });
        } else {
          if (isKwargs) throw new Error(KWARG_ERR);
          ret.push(arg);
        }
      });

      return ret;
    }

    this.tags = ['url'];
    this.parse = function (parser, nodes, lexer) {
      var tag = parser.nextToken();
      var args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tag.value);
      return new nodes.CallExtension(this, 'run', args);
    }
    this.run = function (context, routeName) {
      var routeArgs = Array.prototype.slice.call(arguments, 2);
      routeArgs = parseArgs(routeArgs);
      return router.reverse.apply(router, [routeName].concat(routeArgs));
    }
  },
  Trans: function (jed) {
    this.tags = ['trans'];
    this.parse = function (parser, nodes, lexer) {
      var tag = parser.nextToken();
      var args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tag.value);
      return new nodes.CallExtension(this, 'run', args);
    }
    this.run = function (context, string, domain) {
      var trans = jed.translate(string);
      if (domain) {
        trans = trans.onDomain(domain);
      }
      return trans.fetch();
    }
  }
}
