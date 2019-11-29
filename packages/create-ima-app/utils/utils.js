function checkNodeVersion(min, max) {
  const majVersion = process.version.substring(1).split('.')[0];

  return majVersion >= min && majVersion <= max;
}

module.exports = {
  checkNodeVersion
};
