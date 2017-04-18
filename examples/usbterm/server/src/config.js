let instance = {};

var Config = function(file) {
    var fs = require("fs");

    var cfg;

    try {
        var content = fs.readFileSync(file);
        if ( content.length ) {
            cfg = JSON.parse(content);
        }
    } catch(e) {
        cfg = {}
    }

    let _get = (prop) => {
        return cfg[prop]
    }

    let _set = (prop, value) => {
        cfg[prop] = value;

        fs.writeFileSync(file, JSON.stringify(cfg,null,4));
        return true;
    }

    return {
        get: (prop) => {
            return _get(prop);
        },

        set: (prop, value) => {
            return _set(prop, value);
        }
    }
}

export function createConfig(file) {
    if ( !instance[file]) {
        instance[file] = new Config(file);
    }
    return instance[file];
}
