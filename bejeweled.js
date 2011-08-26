/**
 * ход
 * проверка удаления и если да, то удаление, нет - возврат хода
 * добавление нужного кол-ва элементов сверху
 * обрушение элементов
 * проверка, что ход возможен. если нет - конец игры
 *
 * 01234567
 * 1
 * 2
 * 3
 * 4
 * 5
 * 6
 * 7
 */

var bejeweled = {

    field: null,
    selectedItem: null,

    init: function() {

        self = this;

        field = new Array(8);
        for (var x = 0; x < 8; x++) {
            field[x] = new Array(8);
            for (var y = 0; y < 8; y++) {
                field[x][y] = Math.ceil(Math.random() * 6);
                self._addPiece(x, y, field[x][y]);
            }
        }

        self._processField();

        $('.item').live('click', function() {
            var $elem = $(this);
            if (self.selectedItem != null) {
                self.selectedItem.removeClass('selected');
                self._swap(self.selectedItem, $elem);
                self.selectedItem = null;
            } else {
                self.selectedItem = $elem.addClass('selected');
            }
        });
    },

    _swap: function(elem1, elem2, cancelProcessing) {

        var tmp;

        var coords1 = self._getCoords(elem1);
        var coords2 = self._getCoords(elem2);

        if ((coords1.x == coords2.x && Math.abs(coords1.y - coords2.y) == 1) || (coords1.y == coords2.y && Math.abs(coords1.x - coords2.x) == 1)) {

            var p1 = elem1.position();
            var p2 = elem2.position();

            $('#xy' + coords1.x + coords1.y).animate({ top: p2.top, left: p2.left }, 300);
            $('#xy' + coords2.x + coords2.y).animate({ top: p1.top, left: p1.left }, 300, function() {
                if (!cancelProcessing) {
                    self._processField(elem1, elem2);
                }
            });

            tmp = field[coords1.x][coords1.y];
            field[coords1.x][coords1.y] = field[coords2.x][coords2.y];
            field[coords2.x][coords2.y] = tmp;

            tmp = elem1.attr('id');
            elem1.attr('id', elem2.attr('id'));
            elem2.attr('id', tmp);
        }
    },

    _addPiece: function(x, y, type, top) {
        var div = $('<div class="item"><div>');
        top = top ? (-1 - 2 * top) * 41 : y * 41;
        div.css({ top: top + 'px', left: (x * 41) + 'px', backgroundImage: 'url("im/' + type + '.png")' });
        div.addClass('x' + x).addClass('y' + y).attr('id', ('xy' + x) + y).appendTo('#field');
        return div;
    },

    _hasMove: function() {
        var x, y, value;
        for (x = 0; x < 8; x++) {
            for (y = 0; y < 8; y++) {
                if (y > 0 && y < 7 && field[x][y - 1] == field[x][y + 1]) {
                    value = field[x][y - 1];
                    if ((x > 0 && field[x - 1][y] == value) || (x < 7 && field[x + 1][y] == value)) {
                        return true;
                    }
                }
                if (x > 0 && x < 7 && field[x + 1][y] == field[x - 1][y]) {
                    value = field[x - 1][y];
                    if ((y > 0 && field[x][y - 1] == value) || (y < 7 && field[x][y + 1] == value)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    _processField: function(elem1, elem2) {

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
                    $(('#xy' + x) + y).addClass('remove');
                    needCaving = true;
                }
            }
        }

        $('.remove').animate({ opacity: 0 }, 500, function() {
            $('.remove').remove();
        });

        if (needCaving) {
            setTimeout('self._caving()', 500);
        } else if (elem1 && elem2) {
            self._swap(elem1, elem2, true);
        }
    },

    _caving: function() {

        var x, y, yfull, deleted, delay = 0;

        for (x = 0; x < 8; x++) {
            yfull = 7;
            deleted = 0;
            for (y = 7; y >= 0; y--) {
                while (field[x][y] == 0 && y >= 0) {
                    deleted++;
                    y--;
                }
                if (yfull != y) {
                    var d = yfull - y;
                    delay = Math.max(delay, d * 150);
                    $(('#xy' + x) + y).animate({ top: '+=' + (41 * d) }, d * 150).attr('id', ('xy' + x) + yfull);
                    field[x][yfull] = field[x][y];
                }
                yfull--;
            }

            for (var i = 1; i <= deleted; i++) {
                type = Math.ceil(Math.random() * 6);
                field[x][deleted - i] = type;
                self._addPiece(x, deleted - i, type, i).animate({ top: '+=' + ((deleted + i + 1) * 41) }, 150 * (deleted + i + 1));
                delay = Math.max(delay, 150 * (deleted + i + 1));
            }
        }

        setTimeout('self._processField()', delay);
    },

    _getCoords: function(elem) {
        var id = elem.attr('id');
        return { x: parseInt(id.charAt(2)), y: parseInt(id.charAt(3)) };
    },

    _debug: function() {
        var x, y, str = '';
        for (y = 0; y < 8; y++) {
            for (x = 0; x < 8; x++) {
                str += field[x][y];
            }
            str += "\n";
        }
        console.log(str);
    }

};

$(function() {
    bejeweled.init();
});