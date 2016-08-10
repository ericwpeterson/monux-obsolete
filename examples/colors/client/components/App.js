import React from 'react';
import { PropTypes } from 'react'
import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../src/monobject-actions.js';
import { Button } from 'react-bootstrap';


export default class App extends React.Component {
    
    static propTypes = {
       get: PropTypes.func.isRequired,
       set: PropTypes.func.isRequired,
       set2: PropTypes.func.isRequired,
       watch: PropTypes.func.isRequired,
       unWatch: PropTypes.func.isRequired,       
       state: PropTypes.object.isRequired       
    };
    
    render() {
        
        console.log('render() this.props.state=', this.props.state);

        let style = {};

        style.backgroundColor = 'white';
        style.padding = 100;
        style.margin = 'auto';
        style.width = '100%'
        style.height = '100%';

        let buttonDivStyle = {margin: 'auto', width: 100};

        try {
            if ( this.props.state.monobjects.stats.props.color.value ) {
                style.backgroundColor = this.props.state.monobjects.stats.props.color.value;                
            }            
        } catch(e) {}

        return (
            <div style={style}>                
                <div style={{margin:'auto', width: 100}}>                
                    <Button onClick={this.props.get}> Get Color </Button>                    
                </div>

                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.set}> Set Color = blue </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.set2}> Set Color = green </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.watch}> Watch color </Button>                    
                </div>
                <div style={buttonDivStyle}>                
                    <Button onClick={this.props.unWatch}> Un-Watch color </Button>                    
                </div>
                
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        state: state.toJS()
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        get: () => {
            dispatch(get('stats', 'color'));
        },
        set: () => {
            dispatch(set('stats', 'color', 'blue'));
        },
        set2: () => {
            dispatch(set('stats', 'color', 'green'));
        },
        watch: () => {
            dispatch(watch('stats', 'color'));
        },
        unWatch: () => {
            dispatch(unwatch('stats', 'color'));
        },

        onFinishTest: () => {
            dispatch(finishTest());
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
