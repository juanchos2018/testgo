/**
 * Simple XML parser
 * @param {String} xml
 * @return {Object}
 */
function parseXML(xml) {

    var beg = -1;
    var end = 0;
    var tmp = 0;
    var current = [];
    var obj = {};
    var from = -1;

    while (true) {

        beg = xml.indexOf('<', beg + 1);
        if (beg === -1)
            break;

        end = xml.indexOf('>', beg + 1);
        if (end === -1)
            break;

        var el = xml.substring(beg, end + 1);
        var c = el[1];

        if (c === '?' || c === '/') {

            var o = current.pop();

            if (from === -1 || o !== el.substring(2, el.length - 1))
                continue;

            var path = current.join('.') + '.' + o;
            var value = xml.substring(from, beg);

            if (typeof(obj[path]) === 'undefined')
                obj[path] = value;
            else if (obj[path] instanceof Array)
                obj[path].push(value);
            else
                obj[path] = [obj[path], value];

            from = -1;
            continue;
        }

        tmp = el.indexOf(' ');
        var hasAttributes = true;

        if (tmp === -1) {
            tmp = el.length - 1;
            hasAttributes = false;
        }

        from = beg + el.length;

        var isSingle = el[el.length - 2] === '/';
        var name = el.substring(1, tmp);

        if (!isSingle)
            current.push(name);

        if (!hasAttributes)
            continue;

        var match = el.match(/\w+\=\".*?\"/g);
        if (match === null)
            continue;

        var attr = {};
        var length = match.length;

        for (var i = 0; i < length; i++) {
            var index = match[i].indexOf('"');
            attr[match[i].substring(0, index - 1)] = match[i].substring(index + 1, match[i].length - 1);
        }

        obj[current.join('.') + (isSingle ? '.' + name : '') + '[]'] = obj[current.join('.') + (isSingle ? '.' + name : '') + '[]'] || [];
        obj[current.join('.') + (isSingle ? '.' + name : '') + '[]'].push(attr);
    }

    return obj;
};
