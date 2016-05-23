define([], function () {

    var Utils = (function () {

        var addSpacesToSum = function (price) {
            price = price.toString();
            var splitIndex = (price.length + 2) % 3 + 1;
            return price.substr(0, splitIndex) + price.substr(splitIndex).replace(/\d\d\d/g, ' $&');
        };

        var localizeDatepicker = function () {
            $.datepicker.regional['ru'] = {
                monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                monthNamesShort: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
                dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
                dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
                dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'] ,
                prevText: '<Пред',
                nextText: 'След>',
                currentText: 'Сегодня',
                todayText: 'Сегодня',
                clearText: 'Очистить',
                closeText: 'Закрыть',
                weekText: 'Закрыть',
                isRTL: false
            };

             $.datepicker.setDefaults($.datepicker.regional['ru']);
        };

        var getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length,c.length);
                }
            }
            return "";
        };

        var setCookie = function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        };

        var deleteCookie = function(cname){
            document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        };

        var addValidationMethods = function(cname) {
            $.validator.addMethod('date-rus', function (value, element, param) {
                var dateList = value.split('.');
                var dateStr = dateList[1] + '.' + dateList[0] + '.' + dateList[2];
                return this.optional( element ) || !/Invalid|NaN/.test( new Date( dateStr ).toString() );
            }, "Введите дату в формате дд.мм.гггг");

            $.extend($.validator.messages, {
                required: "Заполните поле",
                number: "Только цифры "
            });
        };

        return {
            addSpacesToSum:       addSpacesToSum,
            localizeDatepicker:   localizeDatepicker,
            getCookie:            getCookie,
            setCookie:            setCookie,
            deleteCookie:         deleteCookie,
            addValidationMethods: addValidationMethods
        };

    })();

    return Utils;

});