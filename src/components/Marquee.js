import React from 'react';

class Marquee extends React.Component {
    render() {
        return (
            <div class="marquee">
                <div>
                    <span>{this.props.text}</span>
                    <span>{this.props.text}</span>
                </div>
            </div>
        );
    }
}

export default Marquee;