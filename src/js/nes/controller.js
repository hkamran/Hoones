/**
 * This object handles and represents the controller of the NES.
 * Its responsibilities is to ensure the player key presses are send to the NES.
 *
 * Created by Hooman Kamran on 1/01/2016.
 */
var Controller = function(id) {


    var index = 0;
    var data = [0, 0, 0, 0, 0, 0, 0, 0];
    var strobe = 0;


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


    /**
     * We iterate on each read, returning the next input until we hit the last. We
     * can only return to the first button if we write 1 into the controller. The controller
     * will then maintain the first input until we write 0.
     */

    return {

        id: id,

        getData : function() {
            return data;
        },

        setData : function(keys) {
          data = keys;
        },

        readByte : function() {
            var result = 0;
            if (index < 8) {
                result = data[index];
            }

            index++;

            if ((strobe & 1) == 1) {
                index = 0;
            }

            if (index > 7) {
                index = 8;
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
            strobe = val;
            if ((strobe & 1) == 1) {
                index = 0;
            }
        },

        getState : function() {
            return {
                data : data,
                strobe : strobe,
                index : index
            }
        },

        loadState : function(state) {
            data = state.data;
            strobe = state.strobe;
            index = state.index;
        },

        keys : keys,
    }
};