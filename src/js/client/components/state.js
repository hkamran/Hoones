/**
 * Created by HK on 10/23/2016.
 */
function State() {
    var cycle;
    var playerId;
    var status;
    var data = {};
}

State.parseJSON = function(json) {
    var state = new State();
    state.data = json.data;
    state.playerId = json.playerId;
    state.cycle = json.cycle;
    return state;
}

State.toJSON = function(nes, playerId) {
    var payload = {
        cycle : nes.cpu.cycles,
        playerId : playerId,
        data : nes.getState()
    };
    return payload;
}

