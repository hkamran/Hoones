/**
 * Created by hkamran on 2/26/2016.
 */
var Controller = function() {

    var index = 0;
    var data = [0, 0, 0, 0, 0, 0, 0, 0];
    var reset = false;

    var keys = {
        up : 4,
        down : 5,
        left : 6,
        right : 7,
        a : 0,
        b : 1,
        select : 2,
        start : 3,
    };

    return {
        readByte : function() {
            var result = data[index];


            index++;

            if (index >= 7) {
                index = 7;
            }
            return result;
        },

        pressKey : function(keyIndex) {
            if (typeof keyIndex === 'undefined') {
                return;
            }

            if (keyIndex > 7) {
                return;
            }

            data[keyIndex] = 1;
        },

        releaseKey : function(keyIndex) {
            if (typeof keyIndex === 'undefined') {
                return;
            }

            if (keyIndex > 7) {
                return;
            }

            data[keyIndex] = 0;
        },

        writeByte : function(val) {
            var even = (val & 1) == 0;
            if (reset && even) {
                index = 0;
            }
            reset = (val & 1) == 1;
        },

        keys : keys,
    }
};

var player1 = new Controller();

