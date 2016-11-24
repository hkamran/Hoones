/**
 * Created by HK on 10/23/2016.
 */
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

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

        if (payload.type == Payload.types.SERVER_PLAYERKEYS) {
            var keys = payload.data;
            handleKeyUpdate(keys);
        } else if (payload.type == Payload.types.SERVER_GETSTATE) {
            handleGetUpdate();
        } else if (payload.type == Payload.types.SERVER_PUTSTATE) {
            var state = payload.data;
            handlePutUpdate(state);
        } else if (payload.type == Payload.types.SERVER_STOP) {
            handleStopUpdate();
        } else if ((payload.type == Payload.types.SERVER_PLAY)) {
            handlePlayUpdate();
        } else if (payload.type == Payload.types.SERVER_WAIT) {
            //TODO
        } else if ((payload.type == Payload.types.SERVER_PLAYERINFO)) {
            handlePlayerUpdate(payload.data);
        }  else if ((payload.type == Payload.types.SERVER_PLAYERCONNECTED)) {
            var player = payload.data;
            handleConnected(player);
        }  else if ((payload.type == Payload.types.SERVER_PLAYERDISCONNECTED)) {
            var player = payload.data;
            handleDisconnected(player);
        } else {
            console.error("Unknown payload type.");
        }
    };

    var handleConnected = function(player) {
        playerConnected(player.id, id);
    }

    var handleDisconnected = function(player) {
        playerDisconnected(player.id);
    }

    /**
     * Server sends player id (onconnect)
     */
    var handlePlayerUpdate = function(player) {
        id = player.id;
        console.info("Connected as player " + id);
        controller = new Controller(id);
        keyboard.init(controller);
    };

    /**
     * Servers sends a GET request which means it wants the users nes state (synching first phase)
     */
    var handleGetUpdate = function() {
        console.log("Sending State");
        nes.stop();
        var state = State.toJSON(nes, id);
        var payload = new Payload(Payload.types.PLAYER_SENDSTATE, state);
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
        var payload = new Payload(Payload.types.PLAYER_WAITING, {});
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
        var payload = new Payload(Payload.types.PLAYER_KEYS, Keys.toJSON(controller, id, keyCounter));
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
        connect : function(hostname, port, id) {
            var url = "ws://" + hostname + ":" + port + "/ws/" + id;
            console.info("Connecting to " + url);
            socket = new WebSocket(url);
            socket.onmessage = onmessage;
            socket.onopen = onopen;
            socket.onclose = onclose;
            socket.onerror = onerror;
            nes.ppu.renderer.postFrame = postFrame;
        },

        disconnect : function() {
            nes.stop();
            if (socket) {
                socket.close();
                nes.ppu.renderer.postFrame = function() {};
                socket = null;
            }
            nes.start();
            keyboard.init(nes.controller1);
        },

        isAlive : function() {
            if (socket) {
                return true;
            }
            return false;
        }


    }
};


