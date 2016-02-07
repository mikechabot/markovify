import React from 'react';
import FontIcon from 'material-ui/lib/font-icon';

/**          Author: Mike Chabot
 *      Description: Generic component that renders icons of certain types
 *                   Icons supported: Material, Font Awesome
 */

class Icon extends React.Component {
    render() {
        switch(this.props.type) {
            case 'material': {
                return (
                    <FontIcon
                        color={this.props.iconColor}
                        style={this.props.style}
                        className="material-icons">
                        {this.props.name}
                    </FontIcon>
                );
            }
            case 'fa': {
                return (
                    <FontIcon
                        color={this.props.iconColor}
                        style={this.props.style}
                        className={`fa fa-${this.props.name}`} />
                );
            }
            default: {
                return <div />;
            }
        }
    }
}

Icon.propTypes = {
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
};

export default Icon;