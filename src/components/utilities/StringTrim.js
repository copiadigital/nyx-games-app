var StringTrim = function(string, maxLength, replacement){
    if(!string || string.length < maxLength){
        return string;
    }

    var searchPattern = /([.,\s])+/;
    var trimPattern = /([.,\s])+$/;

    var trimmed = string.substr(0, maxLength);
    var reverse = trimmed.split('').reverse().join('');
    var reverseOffset = reverse.search(searchPattern);

    if(reverseOffset > -1){
        trimmed = trimmed.substr(0, trimmed.length - reverseOffset - 1).replace(trimPattern, '');
    }

    return trimmed + replacement;
};

export default StringTrim;