
import _ from 'underscore';

let monObjects = {};

let monObjectFactory = {

    getMonObject: function(name) {
        return monObjects[name];
    },

    insertObject: function(name, obj) {
        if (!monObjects[name]) {
            monObjects[name] = obj;
        }
    },

    removeSocket: function(socket) {
        _.each(monObjects, function(monobject, key) {
            try {
                monObjects[key].removeSocket(socket);

            }  catch (e) {
                console.log(e, key);
            }

        });
    }
};

export default monObjectFactory;

