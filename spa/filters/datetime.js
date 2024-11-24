window.angular.module('ERP').filter('elapsed', function(){
    return function (date, lowercase) {
        if (!date) return;

        var preppend = (lowercase ? 'hace ' : 'Hace ');
        
        var time = Date.parse(date),
            timeNow = new Date().getTime(),
            difference = timeNow - time,
            seconds = Math.floor(difference / 1000),
            minutes = Math.floor(seconds / 60),
            hours = Math.floor(minutes / 60),
            days = Math.floor(hours / 24);
        if (days > 1) {
            return preppend + days + " días";
        } else if (days == 1) {
            return preppend + '1 día'
        } else if (hours > 1) {
            return preppend + hours + ' horas';
        } else if (hours == 1) {
            return preppend + '1 hora';
        } else if (minutes > 1) {
            return preppend + minutes + ' minutos';
        } else if (minutes == 1){
            return preppend + '1 minuto';
        } else {
            return preppend + 'un momento';
        }
    };
});

window.angular.module('ERP').filter('pgDate', function (){
    return function (date, parse) {
        if (!date) return;

        if (date.indexOf(' ') >= 0) {
            date = date.split(' ').join('T') + '-0500'; // En Perú la hora siempre es GMT-5
        }

        if (parse) {
            return Date.parse(date);
        } else {
            return date;
        }
    }
});
