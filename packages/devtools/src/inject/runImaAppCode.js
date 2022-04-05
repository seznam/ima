function runImaAppCode() {
  return `
    (() => {
        $IMA.Runner.run = (...rest) => {
            $IMA.Runner.preRunCommands.forEach((command) => {
                command(...rest);
            });
            $IMA.Runner.originalRun(...rest);
        };

        if ($IMA.Runner.scripts.length !== 0 && $IMA.Runner.scripts.length === $IMA.Runner.loadedScripts.length) {
            $IMA.Runner.run();
        }
    })();`;
}

export { runImaAppCode };
