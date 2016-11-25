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
    var type = json.type;
    var data = null;

    if (type == Payload.types.SERVER_PLAYERKEYS) {
        data = Keys.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_GETSTATE) {
    } else if (type == Payload.types.SERVER_PUTSTATE) {
        data = State.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_PLAYERINFO) {
        data = Player.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_STOP) {
    } else if (type == Payload.types.SERVER_PLAY) {
    } else if (type == Payload.types.SERVER_DESTROYED) {
    } else if (type == Payload.types.SERVER_FULL) {
    } else if (type == Payload.types.SERVER_PLAYERCONNECTED) {
        data = Player.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_PLAYERDISCONNECTED) {
        data = Player.parseJSON(json.data);
    } else {
        console.error("Unknown payload type ");
        console.error(json);
    }

    var payload = new Payload(type, data);
    return payload;
}



Payload.types = {};

Payload.types.SERVER_GETSTATE = 0;
Payload.types.SERVER_PUTSTATE = 1;
Payload.types.SERVER_STOP = 2;
Payload.types.SERVER_PLAY = 3;
Payload.types.SERVER_DESTROYED = 13;
Payload.types.SERVER_FULL = 14;

Payload.types.SERVER_PLAYERINFO = 5;
Payload.types.SERVER_PLAYERKEYS = 6;
Payload.types.SERVER_PLAYERCONNECTED = 7;
Payload.types.SERVER_PLAYERDISCONNECTED = 8;

Payload.types.PLAYER_KEYS = 9;
Payload.types.PLAYER_WAITING = 10;
Payload.types.PLAYER_SYNC = 11;
Payload.types.PLAYER_SENDSTATE = 12;