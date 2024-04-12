function removeComma(val) {
  return val
    .replace(/\band\b/g, ',')
    .replace(/\, ,+/, ',')
    .replace(/\ ,+/, ',')
    .split(', ');
}

function convertToBoolean(val) {
  if (val === 'yes') {
    return true;
  } else {
    return false;
  }
}

function handleApostrophe(val) {
  if (typeof val === "string") {
    return val.replace(/'/g, "''");
  } else {
    return val;
  }
}

function getIdFromObjInsideLoop(obj) {
  let id;

  for (const property in obj) {
    if (property == 'id') {
      id = obj[property];
      break;
    }
  }

  return id;
}

module.exports = { convertToBoolean, handleApostrophe, removeComma, getIdFromObjInsideLoop }
