let commonFunc = {};

commonFunc.upper = (str) => {
  return _.upperCase(str);
};

commonFunc.handleBearerToken = (token) => {
  return token.replace("Bearer ", "");
};

global.common = commonFunc;
