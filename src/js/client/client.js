/**
 * Created by HK on 10/23/2016.
 */
var Client = function(nes) {

    var socket;
    var id;

    var controller;

    var keyCounter = 0;
    var keyReady = [true, true];
    var player1 = [];
    var player2 = [];

    var nes = nes;


    var onmessage = function(event) {
        var json = JSON.parse(event.data);
        var payload = Payload.parseJSON(json);

        if (payload.type == Payload.types.KEYS) {
            var keys = payload.data;
            handleKeyUpdate(keys);
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

    /**
     * Server sends player id (onconnect)
     */
    var handlePlayerUpdate = function(player) {
        console.info("YOU ARE PLAYER " + player.id);
        id = player.id;
        controller = new Controller(id);
        keyboard.init(controller);
    };

    /**
     * Servers sends a GET request which means it wants the users nes state (synching first phase)
     */
    var handleGetUpdate = function(state) {
        console.log("Sending State");
        var state = State.toJSON(nes, id);
        var payload = new Payload(Payload.types.GET, state);
        send(payload);
    }

    /**
     * Save the nes state given from the server (syching last phase)
     */
    var handlePutUpdate = function(state) {
        console.log("Got PUT");
        keyReady = [true, true];
        keyCounter = 0;
        nes.loadState(state.data);
        var payload = new Payload(Payload.types.WAITING, {});
        send(payload);
    }


    var handleKeyUpdate = function(keys) {
        var playerId = keys.playerId;
        if (playerId == 1 && keys.cycle == keyCounter) {
            keyReady[0] = true;
            player1 = keys.data;
        } else if (playerId == 2 && keys.cycle == keyCounter) {
            keyReady[1] = true;
            player2 = keys.data;
        } else {
        }

        var ready = true;
        for (var i = 0; i < keyReady.length; i++) {
            ready &= keyReady[i];
        }

        if (ready) {
            postFrame();
        }
    };

    var postFrame = function() {
        if (controller == null) {
            return;
        }

        //Send our Keys
        var payload = new Payload(Payload.types.KEYS, Keys.toJSON(controller, id, keyCounter));
        send(payload);

        //Wait until we receive all the keys
        var ready = true;
        for (var i = 0; i < keyReady.length; i++) {
            ready &= keyReady[i];
        }

        if (!ready) {
            nes.stop();
            return;
        }

        //Once we received all the keys send controller data
        nes.controller1.setData(player1);
        nes.controller2.setData(player2);

        keyCounter++;
        keyReady[0] = false;
        keyReady[1] = false;

        nes.start();
    }.bind(this);

    nes.ppu.renderer.postFrame = postFrame;

    var handleStopUpdate = function() {
        console.info("Stopping emulation");
        nes.stop();
    };

    var handlePlayUpdate = function() {
        console.info("Continuing emulation");
        nes.start();
    };

    //---------------------

    var send = function(event) {
        socket.send(JSON.stringify(event));
    };

    var onopen = function(event) {
        console.info("Connected to " + event.target.url);
    };

    var onclose = function(event) {
        console.info("Closing connection to " + event.target.url);
    };

    var onerror = function(event) {
        console.error("Error from WS", event);
    };


    return {
        connect : function(url) {
            socket = new WebSocket(url);
            socket.onmessage = onmessage;
            socket.onopen = onopen;
            socket.onclose = onclose;
            socket.onerror = onerror;
        },

        keyReady : function() {
            return keyReady;
        }

    }
};


