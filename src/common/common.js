let commonFunc = {};

commonFunc.upper = (str) => {
  return _.upperCase(str);
};

commonFunc.handleBearerToken = (token) => {
  return token.replace("Bearer ", "");
};

commonFunc.shapeImage = (image) => {
  return image.replace("/", "");
};

global.common = commonFunc;
