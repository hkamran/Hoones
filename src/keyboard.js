/**
 * Interfaces to the NES controller to the keyboard
 *
 * Created by Hooman Kamran on 03/09/2016.
 */
var keyboard = {

    keymap : {
        up: 87,          //w
        down: 83,        //s
        left: 65,        //a
        right: 68,       //d
        a: 71,           //g
        b: 72,           //h
        start: 84,       //t
        select: 89       //y
    },

    init : function() {
        console.log("Interfacing keyboard..");

        var keymap = this.keymap;

        document.onkeyup = function (e) {
            var code = e.keyCode;
            var keys = player1.keys;

            if (code == keymap.up) {
                player1.releaseKey(keys.up);
            } else if (code == keymap.down) {
                player1.releaseKey(keys.down);
            } else if (code == keymap.left) {
                player1.releaseKey(keys.left);
            } else if (code == keymap.right) {
                player1.releaseKey(keys.right);
            } else if (code == keymap.a) {
                player1.releaseKey(keys.a);
            } else if (code == keymap.b) {
                player1.releaseKey(keys.b);
            } else if (code == keymap.start) {
                player1.releaseKey(keys.start);
            } else if (code == keymap.select) {
                player1.releaseKey(keys.select);
            }
        };

        document.onkeydown = function (e) {
            var code = e.keyCode;
            var keys = player1.keys;

            if (code == keymap.up) {
                player1.pressKey(keys.up);
            } else if (code == keymap.down) {
                player1.pressKey(keys.down);
            } else if (code == keymap.left) {
                player1.pressKey(keys.left);
            } else if (code == keymap.right) {
                player1.pressKey(keys.right);
            } else if (code == keymap.a) {
                player1.pressKey(keys.a);
            } else if (code == keymap.b) {
                player1.pressKey(keys.b);
            } else if (code == keymap.start) {
                player1.pressKey(keys.start);
            } else if (code == keymap.select) {
                player1.pressKey(keys.select);
            }
        };
    }
}




