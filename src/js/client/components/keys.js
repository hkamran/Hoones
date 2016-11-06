/**
 * Created by HK on 10/23/2016.
 */
function Keys() {
    var data;
    var playerId;
    var cycle;
}

Keys.parseJSON = function(json) {
    var keys = new Keys();
    keys.data = json.data;
    keys.playerId = json.playerId;
    keys.cycle = json.cycle;
    return keys;
}

Keys.toJSON = function(controller, playerId, cycle) {
    var json = {};
    json.data = controller.getData();
    json.playerId = playerId;
    json.cycle = cycle;
    return json;
}