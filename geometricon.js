let canvas,
    ctx;

const CELL_SIZE = 100;

function intHashFromString(str) {
  let intHash = '';
  for (var i = 0; i < str.length; i++) {
    console.log(str[i] + " = ",str.charCodeAt(i));
    intHash += str.charCodeAt(i);
  }
  console.log("intHash", intHash);
  return intHash;
}

function reverseString(str) {
  return str.split("").reverse().join("");
}

function hueFromIntHash(intHash) {
  return parseInt(intHash) % 360;
}

function sumOfDigits(stringOfInts) {
  let digits = stringOfInts.split('');
  let sum = 0;
  for (var i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]);
  }
  return sum;
}

function eightIntegersFromIntHash(intHash) {
  let hash = intHash;
  console.log("Begin eightIntegersFromIntHash", hash);

  if (hash.length < 8) {
    switch (hash.length) {
      case 2:
        console.log("Length 2, POW 5");
        hash = Math.pow(parseInt(hash), 5).toString();
        break;
      case 3:
        console.log("Length 3, POW 4");
        hash = Math.pow(parseInt(hash), 4).toString();
        break;
      case 4:
        console.log("Length 4, POW 3");
        hash = Math.pow(parseInt(hash), 3).toString();
        break;
      default:
        console.log("Default, POW 2");
        hash = Math.pow(parseInt(hash), 2).toString();
    }
    console.log("Done stretching:", hash);
  }

  let sumOfHashDigits = sumOfDigits(hash);
  console.log("sumOfHashDigits",sumOfHashDigits);

  // Make the length of hash divisible by 8
  // by adding the first part of the string
  // to the end, as needed.
  hash += hash.substr(0,8-hash.length % 8);
  console.log("Made divisible by eight:", hash);
  let digits = hash.length / 8;
  console.log("Digits per portion:",digits);

  let regex = new RegExp('.{' + digits + '}', "g");
  let eightStrings = hash.match(regex);
  console.log("eightStrings:",eightStrings);

  let eightIntegers = eightStrings.map((str) => sumOfDigits(str)+sumOfHashDigits);
  console.log("eightIntegers",eightIntegers);

  return eightIntegers;
}

function recipeFromString(str) {
  let intHash = intHashFromString(str);
  return {
    eightIntegers: eightIntegersFromIntHash(intHashFromString(str)),
    forgroundHue: hueFromIntHash(intHash),
    backgroundHue: hueFromIntHash(reverseString(intHash))
  }
}

function generate() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  const INPUT = document.getElementById('input').value || '13 Trillion Avatars';
  const RECIPE = recipeFromString(INPUT);

  const BG_COLOR = 'hsl(' + RECIPE.backgroundHue + ',90%,20%)';
  const FG_COLOR = 'hsl(' + RECIPE.forgroundHue + ',70%,80%)';

  colorRect(0,0,6*CELL_SIZE,6*CELL_SIZE, BG_COLOR);

  console.log("RECIPE:",RECIPE);
  console.log();
  console.log("::::::::::::::::::::::::::::::::::::::::::::");
  console.log("::::::::::::::::::::::::::::::::::::::::::::");


  // OUTER COLUMNS
  parts[RECIPE.eightIntegers[0]%parts.length](1*CELL_SIZE,1*CELL_SIZE,FG_COLOR,4*CELL_SIZE); // TOP
  parts[RECIPE.eightIntegers[1]%parts.length](1*CELL_SIZE,2*CELL_SIZE,FG_COLOR,4*CELL_SIZE); // -
  parts[RECIPE.eightIntegers[2]%parts.length](1*CELL_SIZE,3*CELL_SIZE,FG_COLOR,4*CELL_SIZE); // -
  parts[RECIPE.eightIntegers[3]%parts.length](1*CELL_SIZE,4*CELL_SIZE,FG_COLOR,4*CELL_SIZE); // BOTTOM

  // INNER COLUMNS
  parts[RECIPE.eightIntegers[4]%parts.length](2*CELL_SIZE,1*CELL_SIZE,FG_COLOR,3*CELL_SIZE); // TOP
  parts[RECIPE.eightIntegers[5]%parts.length](2*CELL_SIZE,2*CELL_SIZE,FG_COLOR,3*CELL_SIZE); // -
  parts[RECIPE.eightIntegers[6]%parts.length](2*CELL_SIZE,3*CELL_SIZE,FG_COLOR,3*CELL_SIZE); // -
  parts[RECIPE.eightIntegers[7]%parts.length](2*CELL_SIZE,4*CELL_SIZE,FG_COLOR,3*CELL_SIZE); // BOTTOM
}

function colorRect(topLeftX,topLeftY, width,height, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(topLeftX,topLeftY,width,height);
}

function colorCircle(centerX,centerY, radius, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(centerX,centerY,radius,0,Math.PI*2,true);
  ctx.fill();
}

function quarterCircleNE(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX, topLeftY+CELL_SIZE, CELL_SIZE, Math.PI/2*3, 0, false);
  ctx.lineTo(topLeftX,topLeftY+CELL_SIZE);
  ctx.fill();

  if (mirrorTopLeftX) {
    quarterCircleNW(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function quarterCircleSE(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX, topLeftY, CELL_SIZE, 0, Math.PI/2, false);
  ctx.lineTo(topLeftX,topLeftY);
  ctx.fill();

  if (mirrorTopLeftX) {
    quarterCircleSW(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function quarterCircleSW(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+CELL_SIZE, topLeftY, CELL_SIZE, Math.PI/2, Math.PI, false);
  ctx.lineTo(topLeftX+CELL_SIZE,topLeftY);
  ctx.fill();

  if (mirrorTopLeftX) {
    quarterCircleSE(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function quarterCircleNW(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+CELL_SIZE, topLeftY+CELL_SIZE, CELL_SIZE, Math.PI, Math.PI/2*3, false);
  ctx.lineTo(topLeftX+CELL_SIZE,topLeftY+CELL_SIZE);
  ctx.fill();

  if (mirrorTopLeftX) {
    quarterCircleNE(mirrorTopLeftX,topLeftY,fillColor);
  }
}



function triangleNE(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX+CELL_SIZE, topLeftY);
  ctx.lineTo(topLeftX+CELL_SIZE, topLeftY+CELL_SIZE);
  ctx.fill();

  if (mirrorTopLeftX) {
    triangleNW(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function triangleSE(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(topLeftX+CELL_SIZE, topLeftY);
  ctx.lineTo(topLeftX+CELL_SIZE, topLeftY+CELL_SIZE);
  ctx.lineTo(topLeftX, topLeftY+CELL_SIZE);
  ctx.fill();

  if (mirrorTopLeftX) {
    triangleSW(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function triangleSW(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX+CELL_SIZE, topLeftY+CELL_SIZE);
  ctx.lineTo(topLeftX, topLeftY+CELL_SIZE);
  ctx.fill();

  if (mirrorTopLeftX) {
    triangleSE(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function triangleNW(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(topLeftX, topLeftY);
  ctx.lineTo(topLeftX+CELL_SIZE, topLeftY);
  ctx.lineTo(topLeftX, topLeftY+CELL_SIZE);
  ctx.fill();

  if (mirrorTopLeftX) {
    triangleNE(mirrorTopLeftX,topLeftY,fillColor);
  }
}




function halfCircleLeft(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+50, topLeftY+50, 50, Math.PI/2, Math.PI/2*3, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleRight(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleRight(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+50, topLeftY+50, 50, Math.PI/2*3, Math.PI/2, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleLeft(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleTop(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+50, topLeftY+50, 50, Math.PI, 0, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleTop(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleBottom(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+50, topLeftY+50, 50, 0, Math.PI, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleBottom(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleLeftAlt(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+CELL_SIZE, topLeftY+50, 50, Math.PI/2, Math.PI/2*3, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleRightAlt(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleRightAlt(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX, topLeftY+50, 50, Math.PI/2*3, Math.PI/2, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleLeftAlt(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleTopAlt(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+50, topLeftY+CELL_SIZE, 50, Math.PI, 0, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleTopAlt(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function halfCircleBottomAlt(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(topLeftX+50, topLeftY, 50, 0, Math.PI, false);
  ctx.fill();

  if (mirrorTopLeftX) {
    halfCircleBottomAlt(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function square(topLeftX,topLeftY,fillColor,mirrorTopLeftX) {
  colorRect(topLeftX,topLeftY, CELL_SIZE,CELL_SIZE, fillColor)

  if (mirrorTopLeftX) {
    square(mirrorTopLeftX,topLeftY,fillColor);
  }
}

function blank() {
  return
}

let parts = [
  blank,
  square,
  quarterCircleNE,
  quarterCircleSE,
  quarterCircleSW,
  quarterCircleNW,
  triangleNE,
  triangleSE,
  triangleSW,
  triangleNW,
  // halfCircleRight,
  // halfCircleLeft,
  // halfCircleTop,
  // halfCircleBottom,
  // halfCircleRightAlt,
  // halfCircleLeftAlt,
  // halfCircleTopAlt,
  // halfCircleBottomAlt
]
