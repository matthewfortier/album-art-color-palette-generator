import React from 'react';

class Swatches extends React.Component {
    render() {

        let swatches = [];
        for (const value of this.props.palette) {
            let backgroundColor = `rgba(${value[0]},${value[1]},${value[2]},${value[3]})`;
            swatches.push(
                <div className="color" key={backgroundColor} style={{ backgroundColor: backgroundColor }}></div>
            );
        }

        return (
            <div className="swatches">{swatches}</div>
        )
    }
}

export default Swatches