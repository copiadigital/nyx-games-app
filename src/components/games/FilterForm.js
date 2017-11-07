import React, { Component } from 'react';
import FeaturedFilter from './filters/FeaturedFilter';
import JurisdictionFilter from './filters/JurisdictionFilter';
import CategoryFilter from './filters/CategoryFilter';
import StudioFilter from "./filters/StudioFilter";
import ChannelFilter from "./filters/ChannelFilter";
import ResetFilter from "./filters/ResetFilter";
import SearchFilter from "./filters/SearchFilter";
import SortLink from "./filters/SortLink";
import PropTypes from 'prop-types';


class FilterForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            filter: {}
        };

        this.clearFilter = this.clearFilter.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.filter) {
            this.setState({
                filter: nextProps.filter
            });
        }
    }
    setFilter(data) {
        this.props.filterManager.setFilter(data);
    }
    clearFilter() {
        this.props.filterManager.clearFilter();
    }
    render() {
        const filtersDisabled = (this.state.filter.searchQuery && this.state.filter.searchQuery.length > 0);

        return (
            <div className="wrapper">
                <form className="game-filter">
                    <fieldset className="row">
                        <FeaturedFilter
                            featured={ this.state.filter.featured }
                            setFilter={ this.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <JurisdictionFilter
                            jurisdiction={ this.state.filter.jurisdiction }
                            setFilter={ this.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <CategoryFilter
                            category={ this.state.filter.category }
                            setFilter={ this.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <StudioFilter
                            studio={ this.state.filter.studio }
                            setFilter={ this.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <ChannelFilter
                            channel={ this.state.filter.channel }
                            setFilter={ this.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <ResetFilter
                            reset={ this.clearFilter }
                        />
                    </fieldset>
                    <fieldset className="row sort-search">
                        <label>Sort by:</label>
                        <SortLink
                            field="name"
                            label="A-Z"
                            disabled={ filtersDisabled }
                            active={ this.state.filter.sort === 'name' }
                            order={ (this.state.filter.order === 'desc')? 'desc' : 'asc' }
                            setFilter={ this.setFilter }
                            />
                        <SortLink
                            field="released"
                            label="Date"
                            disabled={ filtersDisabled }
                            active={ this.state.filter.sort === 'released' }
                            order={ (this.state.filter.order === 'desc')? 'desc' : 'asc' }
                            setFilter={ this.setFilter }
                        />

                        <SearchFilter
                            value={ this.state.filter.searchQuery }
                            minLength={ 2 }
                            setFilter={ this.setFilter }
                            />
                    </fieldset>
                </form>
        </div>
        );
    }
}

FilterForm.contextTypes = {
    router: PropTypes.object
};

export default FilterForm;