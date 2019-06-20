import React from 'react';

class Swatches extends React.Component {
  render() {
    let swatches = [];
    for (const value of this.props.palette.palette) {
      let backgroundColor = `rgba(${value.centroid[0]},${value.centroid[1]},${
        value.centroid[2]
      },${value.centroid[3]})`;
      swatches.push(
        <div
          className="color"
          key={backgroundColor}
          style={{ backgroundColor: backgroundColor }}
        ></div>
      );
    }

    return <div className="swatches">{swatches}</div>;
  }
}

export default Swatches;
