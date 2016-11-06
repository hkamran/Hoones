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
        select: 89,      //y
        space: 32        //space
    },

    init : function(controller) {
        console.info("Interfacing keyboard to controller " + controller.id + " ...");

        var keymap = this.keymap;

        document.onkeyup = function (e) {
            var code = e.keyCode;
            var keys = controller.keys;

            if (code == keymap.up) {
                controller.releaseKey(keys.up);
            } else if (code == keymap.down) {
                controller.releaseKey(keys.down);
            } else if (code == keymap.left) {
                controller.releaseKey(keys.left);
            } else if (code == keymap.right) {
                controller.releaseKey(keys.right);
            } else if (code == keymap.a) {
                controller.releaseKey(keys.a);
            } else if (code == keymap.b) {
                controller.releaseKey(keys.b);
            } else if (code == keymap.start) {
                controller.releaseKey(keys.start);
            } else if (code == keymap.select) {
                controller.releaseKey(keys.select);
            }

        };

        document.onkeydown = function (e) {
            var code = e.keyCode;
            var keys = controller.keys;

            if (code == keymap.up) {
                controller.pressKey(keys.up);
            } else if (code == keymap.down) {
                controller.pressKey(keys.down);
            } else if (code == keymap.left) {
                controller.pressKey(keys.left);
            } else if (code == keymap.right) {
                controller.pressKey(keys.right);
            } else if (code == keymap.a) {
                controller.pressKey(keys.a);
            } else if (code == keymap.b) {
                controller.pressKey(keys.b);
            } else if (code == keymap.start) {
                controller.pressKey(keys.start);
            } else if (code == keymap.select) {
                controller.pressKey(keys.select);
            } else if (code == keymap.space) {
                debug.tick();
            }

        };
    }
}




