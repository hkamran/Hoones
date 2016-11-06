/**
 * Created by HK on 10/23/2016.
 */
function Player() {
    var id;
    var cycle;
}

Player.parseJSON = function(json) {
    var player = new Player();
    player.id = json.id;
    player.cycle = json.cycle;
    return player;
}

