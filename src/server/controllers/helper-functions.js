const _ = require('lodash');

exports.checkTuolajiShuai = (array, existingGame) => {
  const tempArray = array;
  let isTuolaji = true;
  let isShuai = true;
  for (let j = 0; j < tempArray.length - 1; j += 1) {
    if (tempArray[j].name === tempArray[j + 1].name
      && tempArray[j].suit === tempArray[j + 1].suit) {
      j += 1;
    } else {
      isTuolaji = false;
      break;
    }
  }
  if (isTuolaji && isShuai) {
    for (let k = 0; k < tempArray.length - 2; k += 2) {
      if (!tempArray[k].trump && tempArray[k].sortValue - 1 !== tempArray[k + 2].sortValue) {
        isTuolaji = false;
        break;
      } else if (existingGame.trumpSuit !== '' || existingGame.trumpSuit !== 'Wild') {
        if ((tempArray[k].name === 'Big Joker' && tempArray[k + 2].name !== 'Little Joker') || (tempArray[k].name === 'Little Joker' && tempArray[k + 2].value !== existingGame.trumpNumber) || (tempArray[k].value === existingGame.trumpNumber && tempArray[k + 2].value !== existingGame.trumpNumber)) {
          isTuolaji = false;
          break;
        }
      } else if ((tempArray[k].name === 'Big Joker' && tempArray[k + 2].name !== 'Little Joker')
        || (tempArray[k].name === 'Little Joker' && tempArray[k + 2].value !== existingGame.trumpNumber && tempArray[k + 2].suit !== existingGame.trumpSuit)
        || (tempArray[k].value === existingGame.trumpNumber
          && tempArray[k].suit === existingGame.trumpSuit
          && tempArray[k + 2].value !== existingGame.trumpNumber)
        || (tempArray[k].value === existingGame.trumpNumber
          && tempArray[k + 2].value !== existingGame.trumpNumber)
        || (tempArray[k].value === existingGame.trumpNumber
          && tempArray[k + 2].sortValue !== 47)
        || (tempArray[k].sortValue - 1 !== tempArray[k + 2])) {
        isTuolaji = false;
        break;
      }
    }
    if (isTuolaji) {
      isShuai = false;
    } else {
      for (let x = 0; x < tempArray.length - 1; x += 1) {
        if (tempArray[x].suit !== tempArray[x + 1].suit
          || (tempArray[x].trump && !tempArray[x + 1].trump)) {
          isShuai = false;
          break;
        }
      }
    }
  } else if (!isTuolaji && isShuai) {
    for (let k = 0; k < tempArray.length - 1; k += 1) {
      if (tempArray[k].suit !== tempArray[k + 1].suit
        || (tempArray[k].trump && !tempArray[k + 1].trump)) {
        isShuai = false;
        break;
      }
    }
  }
  if (isTuolaji) {
    return 'Tuolaji';
  } else if (isShuai) {
    return 'Shuai';
  }
  return null;
};

exports.changeToTrump = (array, trumpSuit, existingGame) => {
  const tempArray = array;
  for (let i = 0; i < tempArray.length; i += 1) {
    if (tempArray[i].suit === trumpSuit) {
      tempArray[i].trump = true;
    } else if (tempArray[i].suit !== 'Wild' && tempArray[i].value !== existingGame.trumpNumber) {
      tempArray[i].trump = false;
    }
  }
};

exports.shuffleDeck = (array) => {
  const tempArray = array;
  for (let i = 0; i < 7; i += 1) {
    for (let j = tempArray.length; j; j -= 1) {
      const rand = Math.floor(Math.random() * j);
      [tempArray[j - 1], tempArray[rand]] = [tempArray[rand], tempArray[j - 1]];
    }
  }
};

exports.pushBack = (hand, tempHand, tempFull, index) => {
  for (let i = 0; i < hand.length; i += 1) {
    if (_.isEqual(tempFull[index], hand[i])) {
      tempHand.push(tempFull[index]);
    }
  }
};
