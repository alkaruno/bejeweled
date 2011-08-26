var speed = 250;

var bejeweled = {

    field: [],
    selectedItem: null,

    init: function() {

        self = this;

        for (var x = 0; x < 8; x++) {
            field[x] = [];
            for (var y = 0; y < 8; y++) {
                field[x][y] = Math.ceil(Math.random() * 6);
                self._addDiv(x, y, field[x][y]);
            }
        }

        self._checkField();

        $('.item').live('click', function() {
            var $elem = $(this);
            $elem.css({ opacity: 0.5 });
            self.selectedItem = $elem;
        });
    },

    /* private */

    _addDiv: function(x, y, type) {
        var div = $('<div class="item"><div>');
        div.css({
            top: (y * 41) + 'px',
            left: (x * 41) + 'px',
            backgroundImage: 'url("im/' + type + '.png")'
        });
        div.addClass('x' + x).addClass('y' + y).addClass(('xy' + x) + y).appendTo('#field');
        return div;
    },

    _checkField: function() {

        var tmp = [];
        var x, y;

        for (x = 0; x < 8; x++) {
            tmp[x] = [];
            for (y = 0; y < 8; y++) {
                tmp[x][y] = 0;
            }
        }

        for (x = 0; x < 8; x++) {
            for (y = 0; y < 8; y++) {
                if (y > 0 && y < 7 && field[x][y] == field[x][y - 1] && field[x][y] == field[x][y + 1]) {
                    tmp[x][y] = 1;
                    tmp[x][y - 1] = 1;
                    tmp[x][y + 1] = 1;
                }
                if (x > 0 && x < 7 && field[x][y] == field[x - 1][y] && field[x][y] == field[x + 1][y]) {
                    tmp[x][y] = 1;
                    tmp[x - 1][y] = 1;
                    tmp[x + 1][y] = 1;
                }
            }
        }

        var needCaving = false;

        for (x = 0; x < 8; x++) {
            for (y = 0; y < 8; y++) {
                if (tmp[x][y] == 1) {
                    field[x][y] = 0;
                    $(('.xy' + x) + y).addClass('remove');
                    needCaving = true;
                }
            }
        }

        $('.remove').animate({ opacity: 0 }, 1500, function() {
            $('.remove').remove();
        });

        if (needCaving) {
            self._caving();
        }

    },

    _caving: function() {

    }

};

$(function() {
    bejeweled.init();
});

/*$(function()
{
    // create field

    for (var y = 0; y < 8; y++)
        for (var x = 0; x < 8; x++)
            addDiv(x, y, Math.ceil(Math.random() * 6));

    $('.item').live('click', function() {
        $(this).css({ opacity: 0.5 });
    });

    // animation test

    $('.x5').animate({
        top: '+=' + 41 * 4
    }, speed * 4);
    addItems(5, 4);

    $('.x4').animate({
        top: '+=' + 41 * 3
    }, speed * 3);
    addItems(4, 3);

    $('.x3').animate({
        top: '+=' + 41 * 5
    }, speed * 5);
    addItems(3, 5);
});

function addItems(x, count) {
    for (var i = 0; i < count; i++) {
        var div = addDiv(x, -2 - (2 * i), Math.ceil(Math.random() * 6));
        div.animate({ top: '+=' + (41 * (count + 1 + i)) }, speed * (count + 1 + i));
    }
}

function fieldCheck() {

}

function addDiv(x, y, type) {
    var div = $('<div class="item"><div>');
    div.css({
        top: (y * 41) + 'px',
        left: (x * 41) + 'px',
        backgroundImage: 'url("im/' + type + '.png")'
    });
    div.addClass('x' + x);
    $('#field').append(div);
    return div;
}*/
