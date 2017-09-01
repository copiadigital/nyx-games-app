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
        return (
            <div className="wrapper wrapper--thin">
                <form className="game-filter">
                    <fieldset className="row">
                        <FeaturedFilter
                            featured={ this.props.filter.featured }
                            setFilter={ this.props.setFilter }
                        />
                        <JurisdictionFilter
                            jurisdiction={ this.props.filter.jurisdiction }
                            setFilter={ this.props.setFilter }
                        />
                        <CategoryFilter
                            category={ this.props.filter.category }
                            setFilter={ this.props.setFilter }
                        />
                        <ProviderFilter
                            provider={ this.props.filter.provider }
                            setFilter={ this.props.setFilter }
                        />
                        <ChannelFilter
                            channel={ this.props.filter.channel }
                            setFilter={ this.props.setFilter }
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