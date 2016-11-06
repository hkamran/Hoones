/**
 * Created by HK on 10/23/2016.
 */
var Client = function(nes) {

    var socket;
    var controller1 = nes.controller1;
    var controller2 = nes.controller2;
    var nes = nes;
    var cpu = nes.cpu;
    var ppu = nes.ppu;
    var id;
    var keyPressQueue = [];
    var pastKeys = [0, 0, 0, 0, 0, 0, 0, 0];

    var onmessage = function(event) {
        var json = JSON.parse(event.data);
        var payload = Payload.parseJSON(json);

        if (payload.type == Payload.types.KEYS) {
            var keys = payload.data;
            handleControllerUpdate(keys);
        } else if ((payload.type == Payload.types.GET)) {
            handleGetUpdate();
        } else if ((payload.type == Payload.types.PUT)) {
            var state = payload.data;
            handlePutUpdate(state);
        } else if ((payload.type == Payload.types.STOP)) {
            handleStopUpdate();
        }  else if ((payload.type == Payload.types.PLAY)) {
            handlePlayUpdate();
        }  else if ((payload.type == Payload.types.PLAYER)) {
            var player = payload.data;
            console.info("User is player " + player.id);
            handlePlayerUpdate(player);
        } else {
            console.error("Unknown payload type.");
        }
    };

    var handlePutUpdate = function(state) {
        console.log("Got PUT");
        keyPressQueue = [];
        nes.loadState(state.data);
        var payload = new Payload(Payload.types.WAITING, {});
        send(payload);
    }

    var handleGetUpdate = function(state) {
        console.log("Sending GET");
        var state = State.toJSON(nes, id);
        var payload = new Payload(Payload.types.GET, state);
        send(payload);
    }

    var handleStopUpdate = function() {
        console.info("Stopping emulation");
        nes.stop();
    };

    var handlePlayUpdate = function() {
        console.info("Continuing emulation");
        nes.start();
    };

    var handleControllerUpdate = function(keys) {
        console.log("Key Update");
        keyPressQueue.push(keys);
    }.bind(this);


    var handlePlayerUpdate = function(player) {
        id = player.id;
        var controller = getController(id);
        keyboard.init(controller);
    };

    var send = function(event) {
        socket.send(JSON.stringify(event));
    };

    var onopen = function(event) {
        console.info("Connected to " + event.target.url);
    };

    var onclose = function(event) {
        console.info("Closing connection to " + url);
    };

    var onerror = function(event) {
        console.error("Error from WS", event);
    };

    var getController = function(id) {
        var controller = controller2;
        if (id == 1) {
            controller = controller1;
        }
        return controller;
    };

    var sendControllerUpdate = function() {
        var controller = getController(id);
        var currentKeys = controller.getData();

        for (var i = 0; i < pastKeys.length; i++) {
            if (currentKeys[i] != pastKeys[i]) {
                pastKeys = currentKeys.slice(0);

                var json = Keys.toJSON(controller, id, this.cpu.cycles);
                var payload = new Payload(Payload.types.KEYS, json);
                send(payload);
                break;
            }
        }
    };

    var processKeyPresses = function() {
        while (keyPressQueue.length != 0) {
            var keys = keyPressQueue[0];
            if (keys.playerId == id) {
                console.error("STOP");
                return;
            }

            if (keys.cycle > cpu.cycles) {
                return;
            } else if (keys.cycle < cpu.cycles - 100000) {
                console.info("DESYNCED " + keys.cycle + " " + cpu.cycles);
                var payload = new Payload(Payload.types.PUT, {});
                send(payload);
                keyPressQueue = [];
                return;
            }

            keyPressQueue.shift();
            var controller = getController(keys.playerId);
            controller.setData(keys.data.slice(0));
        }
    }

    nes.tickCallback = function() {
        sendControllerUpdate();
        processKeyPresses();

    }
    return {
        connect : function(url) {
            socket = new WebSocket(url);
            socket.onmessage = onmessage;
            socket.onopen = onopen;
            socket.onclose = onclose;
            socket.onerror = onerror;
        }
    }
};


