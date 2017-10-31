import React, { Component } from 'react';
import { Multiselect } from 'react-widgets';

class CheckboxMultiselect extends Component {
    constructor(props){
        super(props);

        this.state = {
            open: (props.open)
        };

        this.toggleDisplay = this.toggleDisplay.bind(this);
    }
    renderListItem(options){
        const checked = (options.item.selected);
        const onChange = function(arg){
            console.warn('Checkbox onChange should not be called');
        };
        
        var classes = ['cbms-item'];
        if(options.item.all){
            classes.push('cbms-item__all');
        }else if(checked){
            classes.push('cbms-item__selected');
        }

        return (
            <span className={ classes.join(' ') }>
                <input type="checkbox" checked={checked} onChange={ onChange } />
                <span>{options.text}</span>
          </span>
        );
    }
    toggleDisplay(open){
        this.setState({ open: open });
    }
    close() {
        this.setState({ open: false });
    }
    render() {
        const self = this;
        const values = this.props.value? this.props.value : [];
        const valueField = this.props.valueField;

        let data = this.props.data.map(function(option){
            option.selected = (values.indexOf(option[valueField]) > -1);
            return option;
        });

        if(this.props.allOption){
            var allOption = { all: true };
            allOption[this.props.valueField] = '*';
            allOption[this.props.textField] = this.props.allOption;
            data.unshift(allOption);
        }

        var toggleValue = function(value){
            var item = value[0];
            var newValues;

            if(item[valueField] === '*'){
                newValues = [];
                self.close();
            }else {
                newValues = values;

                if (item.selected) {
                    delete newValues[newValues.indexOf(item[valueField])];
                } else {
                    newValues.push(item[valueField]);
                }
            }

            self.props.onChange(newValues);
        };

        var placeholder = (values.length)? values.length + ' selected' : this.props.placeholder;

        return (
            <Multiselect
                {...this.props}
                data={ data }
                value={ [] }
                placeholder={ placeholder }
                onChange={ toggleValue }
                onToggle={this.toggleDisplay}
                itemComponent={this.renderListItem}
                open={this.state.open}
            />
        );
    }
}

export default CheckboxMultiselect;