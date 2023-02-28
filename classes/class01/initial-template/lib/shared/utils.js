function supportsWorkerType() {
  let supports = false;
  const tester = {
    get type() {
      supports = true;
    },
  };
  try {
    // tenta criar um worker em background checando se tem acesso a propriedade de tipo (só suportada quando tem o tipo módulo tb)
    new Worker("blob://", tester).terminate();
  } finally {
    return supports;
  }
}

function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now();
  return {
    shouldRun() {
      const result = Date.now() - lastEvent > timerDelay;
      if (result) lastEvent = Date.now();
      return result;
    },
  };
}

export { supportsWorkerType, prepareRunChecker };
