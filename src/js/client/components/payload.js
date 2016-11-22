/**
 * Created by HK on 10/23/2016.
 */
function Payload(type, payload) {
    var type = type;
    var data = payload;

    return {
        type : type,
        data : data
    }
};

Payload.parseJSON = function(json) {
    var type = Payload.types.valueOf(json.type);
    var data = null;

    if (type == Payload.types.KEYS) {
        data = Keys.parseJSON(json.data);
    } else if (type == Payload.types.GET) {
    } else if (type == Payload.types.PUT) {
        data = State.parseJSON(json.data);
    } else if (Payload.types.cmp(Payload.types.STOP, type)) {
    } else if (Payload.types.cmp(Payload.types.PLAY, type)) {
    } else if (Payload.types.cmp(Payload.types.WAITING, type)) {
    } else if (Payload.types.cmp(Payload.types.PLAYER, type)) {
        data = Player.parseJSON(json.data);
    }  else if (Payload.types.cmp(Payload.types.CONNECTED, type)) {
        data = Player.parseJSON(json.data);
    }  else if (Payload.types.cmp(Payload.types.DISCONNECTED, type)) {
        data = Player.parseJSON(json.data);
    } else {
        console.error("Unknown payload type.");
    }

    var payload = new Payload(type, data);
    return payload;
}

Payload.types = {
    valueOf : function(source) {
        if (source.localeCompare(Payload.types.GET) == 0) {
            return Payload.types.GET;
        } else if (source.localeCompare(Payload.types.PUT) == 0) {
            return Payload.types.PUT;
        } else if (source.localeCompare(Payload.types.KEYS) == 0) {
            return Payload.types.KEYS;
        } else if (source.localeCompare(Payload.types.PLAYER) == 0) {
            return Payload.types.PLAYER;
        } else if (source.localeCompare(Payload.types.STOP) == 0) {
            return Payload.types.STOP;
        } else if (source.localeCompare(Payload.types.PLAY) == 0) {
            return Payload.types.PLAY;
        } else if (source.localeCompare(Payload.types.WAITING) == 0) {
            return Payload.types.WAITING;
        }  else if (source.localeCompare(Payload.types.CONNECTED) == 0) {
            return Payload.types.CONNECTED;
        }  else if (source.localeCompare(Payload.types.DISCONNECTED) == 0) {
            return Payload.types.DISCONNECTED;
        } else {
            return Payload.types.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};

Payload.types.GET = "GET";
Payload.types.PUT = "PUT";
Payload.types.KEYS = "KEYS";
Payload.types.PLAYER = "PLAYER";
Payload.types.STOP = "STOP";
Payload.types.PLAY = "PLAY";
Payload.types.WAITING = "WAITING";
Payload.types.CONNECTED = "CONNECTED";
Payload.types.DISCONNECTED = "DISCONNECTED";