export class LineGraph extends React.Component {
    constructor() {
        super();
    }
    render() {
        let child;

        if ( !this.state.collapsed ) {
            child =
                <div style={lineGraphContainerStyle}> imagine a line graph here
                </div>
        }
        return (
            <div style={divStyle}>
                {child}
            </div>
        );
    }
}


export class Days extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(d) {
    }

    render() {
        //TODO: This is where we would create a line graph child
        return (
            <div style={divStyle}>
                <BoxPlot id='days' title='Days' data={this.props.data} min={this.props.min} max={this.props.max}
                    clickHandler={this.clickHandler}
                />
            </div>
        )
    }
};
