const FuCounter = {
  create: (opts) => {
    opts = opts || {};

    // Options:
    const fuDebug = opts.debug || false;
    const fuPrintOnExit = opts.printOnExit || false;
    const fuName = opts.name || 'Unnamed';
    const fuWatch = opts.watch || null;

    const fuStats = {};
    let fuWatchInterval = null;

    const creator = (name, fnc) => {
      // Todo: if name != string
      // Infer the fnc from the toString
      if (typeof name !== 'string') {
        fnc = name;
        name = fnc.name || new Error().stack.split('\n', 3)[2].trim().split(' ', 2)[1];
      }

      if (fuDebug) {
        console.debug(`Wrapped ${name} with a fu counter`);
      }

      // Initialize
      fuStats[name] = fuStats[name] || 0;

      return async function () {
        const scope = this;

        fuStats[name]++;

        return await fnc.apply(scope, arguments);
      };
    };

    creator.print = () => {
      const allCounts = Object.keys(fuStats);
      let maxCount = 0;
      let summary = [];
      for (const k of allCounts) {
        const fncCount = fuStats[k];
        maxCount = Math.max(maxCount, fncCount);
        summary.push({ name: k, count: fncCount });
      }

      // Figure out what the character width is of the larged number
      const width = maxCount.toString().length;

      // Sort according to count, then alphabetically
      summary.sort((l, r) => {
        return (r.count - l.count)
          + (r.name > l.name ? 1 : -1)
        ;
      });
      console.log(
        fuName + ' (fu counter):\n'
        + '  ' + summary
          .map((s) => `${s.count.toString().padStart(width)} ${s.name}`)
          .join('\n  ')
      );
    };
    creator.reset = () => {
      for (const k of Object.keys(fuStats)) {
        fuStats[k] = 0;
      }
    };
    creator.stats = () => { return fuStats; };
    creator.stopWatch = () => {
      if (fuWatchInterval) {
        if (fuDebug) {
          console.debug("Stopping fu watch");
        }

        clearInterval(fuWatchInterval);
        fuWatchInterval = null;
      }
    };

    if (fuPrintOnExit && typeof process === 'object') {
      process.on('exit', () => {
        if (fuDebug) {
          console.debug("Printing fu counters on exit");
        }
        creator.print();
      });
    }

    if (fuWatch) {
      if (fuDebug) {
        console.debug("Setting up fu watch");
      }
      fuWatchInterval = setInterval(creator.print, fuWatch);
    }

    return creator;
  }
};

// Poor man's module loader
// good enough
if (typeof window === 'object') {
  window.FuCounter = FuCounter;
}
if (typeof module === 'object' && typeof module.exports) {
  module.exports = FuCounter;
}
