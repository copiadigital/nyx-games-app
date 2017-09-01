import React, { Component } from 'react';
import FeaturedFilter from './filters/FeaturedFilter';
import JurisdictionFilter from './filters/JurisdictionFilter';
import CategoryFilter from './filters/CategoryFilter';
import ProviderFilter from "./filters/ProviderFilter";
import ChannelFilter from "./filters/ChannelFilter";
import ResetFilter from "./filters/ResetFilter";
import SearchFilter from "./filters/SearchFilter";

class FilterForm extends Component {
    render() {
        const filtersDisabled = (this.props.filter.searchQuery && this.props.filter.searchQuery.length > 0);

        return (
            <div className="wrapper wrapper--thin">
                <form className="game-filter">
                    <fieldset className="row">
                        <FeaturedFilter
                            featured={ this.props.filter.featured }
                            setFilter={ this.props.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <JurisdictionFilter
                            jurisdiction={ this.props.filter.jurisdiction }
                            setFilter={ this.props.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <CategoryFilter
                            category={ this.props.filter.category }
                            setFilter={ this.props.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <ProviderFilter
                            provider={ this.props.filter.provider }
                            setFilter={ this.props.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <ChannelFilter
                            channel={ this.props.filter.channel }
                            setFilter={ this.props.setFilter }
                            disabled={ filtersDisabled }
                        />
                        <ResetFilter
                            setFilter={ this.props.setFilter }
                        />
                    </fieldset>
                    <fieldset className="row">
                        <label>Sort by:</label>
                        <SearchFilter
                            value={ this.props.filter.searchQuery }
                            minLength={ 2 }
                            setFilter={ this.props.setFilter }
                            />
                    </fieldset>
                </form>
        </div>
        );
    }
}

export default FilterForm;