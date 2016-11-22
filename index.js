function createLib (execlib) {
  return {
    Timer: require('./timercreator')(execlib)
  };
}

module.exports = createLib;
