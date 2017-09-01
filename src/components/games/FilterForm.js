import React, { Component } from 'react';
import FeaturedFilter from './filters/FeaturedFilter';
import JurisdictionFilter from './filters/JurisdictionFilter';
import CategoryFilter from './filters/CategoryFilter';
import ProviderFilter from "./filters/ProviderFilter";
import ChannelFilter from "./filters/ChannelFilter";
import ResetFilter from "./filters/ResetFilter";
import SearchFilter from "./filters/SearchFilter";
import SortLink from "./filters/SortLink";

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
                        <SortLink
                            field="name"
                            label="A-Z"
                            disabled={ filtersDisabled }
                            active={ this.props.filter.sort === 'name' }
                            order={ (this.props.filter.order === 'desc')? 'desc' : 'asc' }
                            setFilter={ this.props.setFilter }
                            />

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