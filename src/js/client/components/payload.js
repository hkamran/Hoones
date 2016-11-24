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

    if (type == Payload.types.SERVER_PLAYERKEYS) {
        data = Keys.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_GETSTATE) {
    } else if (type == Payload.types.SERVER_PUTSTATE) {
        data = State.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_PLAYERINFO) {
        data = Player.parseJSON(json.data);
    } else if (type == Payload.types.SERVER_STOP) {
    } else if (type == Payload.types.SERVER_PLAY) {
    } else if (type == Payload.types.SERVER_WAIT) {
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



Payload.types = {
    valueOf : function(source) {
        if (source.localeCompare(Payload.types.SERVER_GETSTATE) == 0) {
            return Payload.types.SERVER_GETSTATE;
        } else if (source.localeCompare(Payload.types.SERVER_PUTSTATE) == 0) {
            return Payload.types.SERVER_PUTSTATE;
        } else if (source.localeCompare(Payload.types.SERVER_PLAYERKEYS) == 0) {
            return Payload.types.SERVER_PLAYERKEYS;
        } else if (source.localeCompare(Payload.types.SERVER_PLAYERINFO) == 0) {
            return Payload.types.SERVER_PLAYERINFO;
        } else if (source.localeCompare(Payload.types.SERVER_STOP) == 0) {
            return Payload.types.SERVER_STOP;
        } else if (source.localeCompare(Payload.types.SERVER_PLAY) == 0) {
            return Payload.types.SERVER_PLAY;
        } else if (source.localeCompare(Payload.types.SERVER_WAIT) == 0) {
            return Payload.types.SERVER_WAIT;
        }  else if (source.localeCompare(Payload.types.SERVER_PLAYERCONNECTED) == 0) {
            return Payload.types.SERVER_PLAYERCONNECTED;
        }  else if (source.localeCompare(Payload.types.SERVER_PLAYERDISCONNECTED) == 0) {
            return Payload.types.SERVER_PLAYERDISCONNECTED;
        } else {
            return Payload.types.NONE;
        }
    },

    cmp : function(a, b) {
        return (a.localeCompare(b) == 0);
    }
};


Payload.types.SERVER_GETSTATE = "SERVER_GETSTATE";
Payload.types.SERVER_PUTSTATE = "SERVER_PUTSTATE";
Payload.types.SERVER_STOP = "SERVER_STOP";
Payload.types.SERVER_PLAY = "SERVER_PLAY";
Payload.types.SERVER_WAIT = "SERVER_WAIT";

Payload.types.SERVER_PLAYERINFO = "SERVER_PLAYERINFO";
Payload.types.SERVER_PLAYERKEYS = "SERVER_PLAYERKEYS";
Payload.types.SERVER_PLAYERCONNECTED = "SERVER_PLAYERCONNECTED";
Payload.types.SERVER_PLAYERDISCONNECTED = "SERVER_PLAYERDISCONNECTED";

Payload.types.PLAYER_KEYS = "PLAYER_KEYS";
Payload.types.PLAYER_WAITING = "PLAYER_WAITING";
Payload.types.PLAYER_SYNC = "PLAYER_SYNC";
Payload.types.PLAYER_SENDSTATE = "PLAYER_SENDSTATE";