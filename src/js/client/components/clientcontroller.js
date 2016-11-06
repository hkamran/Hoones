/**
 * Created by HK on 10/23/2016.
 */
function ClientController() {
    var keys;
    var id;
    var cycle;
}

ClientController.parseJSON = function(json) {
    var controller = new Controller();
    controller.keys = json.data;
    controller.id = json.id;
    controller.cycle = json.cycle;
    return controller;
}

ClientController.toJSON = function(controller, id, cycle) {
    var json = {};
    json.keys = controller.data;
    json.id = id;
    json.cycle = cycle;
    return json;
}