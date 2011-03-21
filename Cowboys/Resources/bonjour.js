//The majority of this code comes straight from the kitchensink available
//freely from www.appcelerator.com as part of the Titanium Mobile package
var bonjourConnect = function(name, packet) {

	// Publish a local service on startup
    var bonjourSocket = Titanium.Network.createTCPSocket({
        hostName:Titanium.Network.INADDR_ANY,
        port:40401,
        mode:Titanium.Network.READ_WRITE_MODE
    });

    bonjourSocket.addEventListener('read', function(e) {
        var remoteSocket = e.from;
        var dataStr = e.data.text;
        if (dataStr == 'req') {
            bonjourSocket.write('Hello, from '+Titanium.Platform.id, remoteSocket);
        }
        else {
            Titanium.UI.createAlertDialog({
                title:'Unknown listener message...',
                message:dataStr
            }).show();

            // WARNING: There's some weird issue here where data events may or may
            // not interact with UI update events (including logging) and this
            // may result in some very ugly undefined behavior... that hasn't been
            // detected before because only UI elements have fired events in the
            // past.
            //
            // Unfortunately, Bonjour is completely asynchronous and requires event
            // firing: Sockets require it as well to reliably deliver information
            // about when new data is available.
            //
            // In particular if UI elements are updated 'out of order' with socket
            // data (especially modal elements, like dialogs, from inside the callback)
            // there may be some very bad results.  Like... crashes.
        }
    });
    bonjourSocket.listen();

    var localService = Titanium.Network.createBonjourService({
        name:'Bonjour Test: '+Titanium.Platform.id,
        type:'_utest._tcp',
        domain:'local.'
    });
	
};
