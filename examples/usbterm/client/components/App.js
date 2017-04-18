import R from 'ramda'
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Button, FormControl, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../ducks/monobject';

const headFootBorderColor = '#b0bac1';
const panelTopMargin = 15;

var Maybe = function(val) {
    this.__value = val;
};

Maybe.of = function(val) {
    return new Maybe(val);
};

Maybe.prototype.isNothing = function() {
    return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.value = function() {
    return this.__value;
};

Maybe.prototype.notValue = function() {
    return !this.__value;
};


Maybe.prototype.map = function(f) {
    if (this.isNothing()) {
        return Maybe.of(null);
    }
    return Maybe.of(f(this.__value));
};

Maybe.prototype.orElse = function(val) {
    if (this.isNothing()) {
        return Maybe.of(val);
    }
    return this;
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            command: "",
            showUSBLocationModal: false
        }
    }

    componentDidMount() {
        var self = this;
        window.addEventListener("resize", ()=>{
            self.forceUpdate();
        });

        setTimeout( ()=> {this.props.watchUsbConnection()}, 500 );
        setTimeout( ()=> {this.props.watchHidReplies()}, 500 );
        setTimeout( ()=> {this.props.watchUSBLocation()}, 500 );
    }

    doFirmwareUpdate() {
        this.props.doFirmwareUpdate()
    }

    showModal() {
        this.setState({showModal: true})
    }

    handleCommandChange = (event) => {
        this.setState({ command: event.target.value });
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.props.write(this.state.command)
        }
    };

    setLocation = (event) => {
        this.setState({showUSBLocationModal: true });
    };

    showUSBLocationModal = (show, save) => {
        this.setState({showUSBLocationModal: show });

        if ( save ) {
            let vid = this.state.vid;
            let pid = this.state.pid;

            this.setState({pid: null, vid: null }, () => {
                this.props.setUSBLocation({'vid': vid, 'pid': pid});
            });

        } else {
            this.setState({pid: null, vid: null });
        }
    };

    handleVidChange = (event) => {
        this.setState ( {vid: event.target.value})
    };

    handlePidChange = (event) => {
        this.setState ( {pid: event.target.value})
    };

    render() {
        let vid, pid;
        let monuxState = this.props.app.toJS();

        let monuxCompleteState = (val) => {
            return val.state === "COMPLETED"?val.value:null;
        }

        let connected = Maybe.of(monuxState)
            .map(R.prop('monobjects'))
            .map(R.prop('hid')).map(R.prop('props'))
            .map(R.prop('connected'))
            .map(R.prop('value'))
            .value() === true;

        let _replies = Maybe.of(monuxState)
            .map(R.prop('monobjects'))
            .map(R.prop('hid')).map(R.prop('props'))
            .map(R.prop('replies'))
            .map(monuxCompleteState).orElse(undefined).value()

        let location = Maybe.of(monuxState)
            .map(R.prop('monobjects'))
            .map(R.prop('hid')).map(R.prop('props'))
            .map(R.prop('location'))
            .map(monuxCompleteState).orElse(undefined).value()


        let savedVid, savedPid;

        if ( location ) {
            vid = location.vid;
            pid = location.pid;

            savedVid = location.vid;
            savedPid = location.pid;
        }

        if ( typeof this.state.pid === 'string') {
            pid = this.state.pid;
        }

        if ( typeof this.state.vid === 'string' ) {
            vid = this.state.vid;
        }

        let replies

        if ( _replies ) {
            replies = _replies.reduce( (acc, value) => {
                acc += "\n";
                acc += value;
                return acc;
            }, "");
        }

        return (
            <div style={{  alignItems: 'space-between', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', overflowX: 'auto'} } >

                { /* HEADER /////////////////////////////////////////////// */ }
                <div style={{ borderBottomColor: headFootBorderColor, borderBottomWidth: 1, borderBottomStyle: 'solid',  width: '100%', height: 80, backgroundColor: 'rgb(226, 226, 226)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{marginLeft: 20}} >
                        <h1 style={{fontFamily: 'monospace'}}> UsbTerm </h1>
                    </div>
                    <div style={{marginRight: 20}}>
                    </div>
                </div>
                { /* Text Area /////////////////////////////////////////////// */ }
                <div >
                    <FormControl
                        style={{height: window.innerHeight - 151, width: window.innerWidth }}
                        componentClass="textarea"
                        value = {replies}
                        inputRef = {  (textarea) => {
                                if (textarea) {
                                    textarea.scrollTop = textarea.scrollHeight;
                                }
                            }
                        }
                    />
                </div>
                { /* Command input /////////////////////////////////////////////// */ }
                <input
                    type="text"
                    value={this.state.command}
                    onChange={this.handleCommandChange.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)}
                />
                { /* USB Location Modal /////////////////////////////////////////////// */ }
                <div style={{paddingLeft: 50, paddingRight: 50} } >
                    <div style={{height:20}}></div>

                    <Modal onHide={this.showUSBLocationModal.bind(this, false, false)} style={{position: 'fixed', top: (window.innerHeight / 2) - 160}}  dialogClassName="usbmodel" show={this.state.showUSBLocationModal} >
                        <Modal.Header closeButton >
                            <Modal.Title>USB Location</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{paddingLeft: 100, paddingRight: 100, width:'100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >

                                <div>
                                    vid:
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={vid}
                                        onChange={this.handleVidChange.bind(this)}
                                    />
                                </div>
                            </div>

                            <div style={{paddingLeft: 100, paddingRight: 100, width:'100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                <div>
                                    pid:
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={pid}
                                        onChange={this.handlePidChange.bind(this)}
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button  onClick={this.showUSBLocationModal.bind(this, false, false)}>Cancel</Button>
                            <Button bsStyle="primary" onClick={this.showUSBLocationModal.bind(this, false, true)} >Ok</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                { /* Footer /////////////////////////////////////////////// */ }
                <div style={{borderTopColor: headFootBorderColor, borderTopWidth: 1, borderTopStyle: 'solid', position: 'fixed', bottom: 0, width: '100%' }} >
                    <div style={{ width: '100%', height: 45, backgroundColor: 'rgb(226, 226, 226)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{marginLeft: 0}} >
                            <strong> <a onClick={this.setLocation.bind(this)}>  {connected?"Connected Vid="+savedVid+",Pid="+savedPid:"Unable to connect to USB Device" }  </a> </strong>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        app: state.monobjectReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        watchUsbConnection: (type) => {
            dispatch(watch('hid', 'connected' ));
        },
        watchHidReplies: () => {
            dispatch(watch('hid', 'replies' ));
        },
        write: (buf) => {
            dispatch(call('hid', 'write', [buf] ));
        },
        setUSBLocation: (loc) => {
            dispatch(set('hid', 'location', loc ));
        },
        watchUSBLocation: () => {
            dispatch(watch('hid', 'location'));
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(Home);
export default AppContainer;
