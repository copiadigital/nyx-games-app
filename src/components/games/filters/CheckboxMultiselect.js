import React, { Component } from 'react';
import { Multiselect } from 'react-widgets';

class CheckboxMultiselect extends Component {
    renderListItem(options){
        const checked = (options.item.selected);
        const onChange = function(arg){
            console.warn('Checkbox onChange should not be called');
        };

        if(options.item.all){
            return (
                <span className="cbms-item cbms-item__all">
                    <span>{options.text}</span>
                </span>
            )
        }

        var classes = ['cbms-item'];
        if(checked){
            classes.push('cbms-item__selected');
        }

        return (
            <span className={ classes.join(' ') }>
                <input type="checkbox" checked={checked} onChange={ onChange } />
                <span>{options.text}</span>
          </span>
        );
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
                itemComponent={this.renderListItem}
            />
        );
    }
}

export default CheckboxMultiselect;