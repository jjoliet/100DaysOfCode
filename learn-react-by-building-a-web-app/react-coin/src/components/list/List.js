import React from 'react';
import { handleResponse } from '../../helpers';
import { API_URL } from '../../config';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';

class List extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1,
        }
        /* This needs to be done to make sure 'this' keyword gets bound to the function */
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
    }

    componentDidMount() {
        this.fetchCurrencies();
    }

    fetchCurrencies() {
        this.setState({ loading: true });
        const { page } = this.state;
        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
            .then(handleResponse)
            .then((data) => {
                const { currencies, totalPages } = data;
                console.log('Success', data);
                this.setState({
                    currencies,
                    totalPages,
                    loading: false,
                });
            })
            .catch((error) => {
                console.log('Error', error);
                this.setState({
                    error: error.errorMessage,
                    loading: false,
                });
            });
    }

    renderChangePercent(percent) {
        if (percent > 0) {
            return <span className="percent-raised">{percent}% &uarr;</span>
        } else if (percent < 0) {
            return <span className="percent-fallen">{percent}% &darr;</span>
        } else {
            return <span>{percent}%</span>
        }
    }

    /* 
    Alternative to the binding before, a current way of binding would be
    handlePaginationClick = (direction) => {func def}
    */
    handlePaginationClick(direction) {
        let nextPage = this.state.page;
        nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;
        /* setState works asynchronously, use a callback to only fetch after the update */
        this.setState({ page: nextPage }, () => {
            this.fetchCurrencies();
        });

    }

    render() {
        const { loading, error, currencies, page, totalPages } = this.state;
        if (loading) {
            return <div className="loading-container"><Loading /></div>
        }

        if (error) {
            return <div className="error">{error}</div>
        }

        return (
            <div>
                <Table currencies={currencies}
                    renderChangePercent={this.renderChangePercent} />

                <Pagination page={page} totalPages={totalPages} handlePaginationClick={this.handlePaginationClick} />
            </div>
        );
    }
}

export default List;