
# monux

[MonObjects](https://github.com/ericwpeterson/monobjects) + Redux = Monux

Marrying Redux and [MonObjects](https://github.com/ericwpeterson/monobjects) to provide a structured state shape and maximize code reuse. 

## Examples 
* [Colors](https://github.com/ericwpeterson/monux/tree/master/examples/colors)
* [react-d3-grouped-boxplots] (https://github.com/ericwpeterson/monux/tree/master/examples/react-d3-boxplot)
* 


## Installation

* git clone https://github.com/ericwpeterson/monux.git
* npm install
* npm test

Copy files from src to your project. 

## The Monux State Shape

```javascript

export const REQUEST = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

{
  monobjects: {
    dog: {
      props: {
        color: {
          value: 'brown',
          state: REQUEST.COMPLETED
        }
      },
      methods: {
        bark: {
          value: "Arroof",
          state: REQUEST.COMPLETED
        },
        sit: {
          state: REQUEST.INPROGRESS
        },
        rollOver: {
          state: REQUEST.ERROR
        }
      }
    }
  }
} 
```
## Annnd Action! 

```javascript
export function get(monobject, property) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Get",
            data: {
                monobject: monobject,
                property: property
            }
        }
    };
}

export function set(monobject, property, value) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Set",
            data: {
                monobject: monobject,
                property: property,
                value: value
            }
        }
    };
}

export function call(monobject, method, args) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Call",
            data: {
                monobject: monobject,
                method: method,
                args: args
            }
        }
    };
}

export function watch(monobject, property) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "Watch",
            data: {
                monobject: monobject,
                property: property
            }
        }
    };
}

export function unwatch(monobject, property) {
    return {
        type: 'SEND_REQUEST',
        payload: {
            message: "UnWatch",
            data: {
                monobject: monobject,
                property: property
            }
        }
    };
}


```
