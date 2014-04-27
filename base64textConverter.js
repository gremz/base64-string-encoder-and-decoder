String.prototype.toBase64 = function() {
  var arr = this.split(''),
      base64Index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(''),
      zeroPadding,
      tmpAscii,
      tmpBinary,
      totalBinary = '',
      tmpOctet,
      base64Encode = '';
    
  arr.forEach( function(element, position) {
    tmpAscii = element.charCodeAt(0);
    tmpBinary = tmpAscii.numToBinary();
    
    // add zero padding
    zeroPadding = 8 - tmpBinary.length;

    for (var i=0; i < zeroPadding; i++) {
      tmpBinary = tmpBinary.concat('0');
    }

    // add calculated binary to total
    totalBinary += tmpBinary.split('').reverse().join('');
  });

  // lets break totalBinary down into octets
  while (totalBinary.length > 0) {
    var tmpOctet = totalBinary.slice(0, 6),
        isOctet = tmpOctet.length % 3,
        base64Code = 0,
        //padding needed?
        addEquals = isOctet && 6 - tmpOctet.length;

    // lets add zero padding if octet
    isOctet && (tmpOctet += '00000'.slice(0, 6 - tmpOctet.length));
    totalBinary = totalBinary.substr(6);
    base64Code = tmpOctet.binaryToNum();

    base64Encode += base64Index[base64Code];

    if (addEquals) {
      switch (addEquals) {
        case 2:
          base64Encode += '=';
          break;
        case 4:
          base64Encode += '==';
          break;
      }
    }
  }

  return base64Encode;
};

String.prototype.fromBase64 = function() {
  var base64Array = this.match(/.{1,4}/g), //break down into 4 character sets
      base64Index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(''),
      tmpOctet,
      eightBitBinaryTotal = '',
      eightBitBinary,
      finalString = '';
  // parse encoded -> index -> binary
  base64Array.forEach( function(element) {
    tmpOctet = element.split('');
    tmpOctet.forEach( function(element) {
      eightBitBinary = base64Index.indexOf(element) > -1 ? base64Index.indexOf(element).numToBinary() : '';
      eightBitBinary.length < 6 && (eightBitBinary += '00000'.substr(0, 6-eightBitBinary.length));
      eightBitBinaryTotal += eightBitBinary.split('').reverse().join('');
    });
  });

  // split 8-byte binary -> ascii
  eightBitBinaryTotal = eightBitBinaryTotal.match(/.{1,8}/g);

  eightBitBinaryTotal.forEach( function(element) {
    finalString += String.fromCharCode(element.binaryToNum());
  });

  return finalString;
};

Number.prototype.numToBinary = function() {
  var tmpBinary = '',
      num = this;

  do {
      tmpBinary = tmpBinary.concat((num % 2).toString());
      num = ~~(num/2);
    } while (num > 0);

  return tmpBinary;
};

String.prototype.binaryToNum = function() {
  var binary = this.split('').reverse(),
      finalDeci = 0;

  binary.forEach( function(element, position) {
    switch (element) {
      case '1':
        finalDeci += Math.pow(2, position);
        break;
      case '0':
        break;
    }
  });

  return finalDeci;
};  