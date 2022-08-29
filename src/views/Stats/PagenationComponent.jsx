import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import PropTypes from "prop-types";

export function PaginationComponent({getAllData, totalRecords, itemsCountPerPage}) {
  
  
  const [curPage, setCurPage] = useState(0);
  useEffect(() => {
    
  }, []);
  
  //Handle Page Change
  handlePageChange = page => {
    this.setState({
      activePage: page
    });
    this.props.getAllData(page);
  };

  componentWillReceiveProps = nextProps => {
    this.componentDidMount(nextProps);
  };

  //Return pagination UI
  render() {
    let { activePage, limit, totalRecords } = this.state;
    return (
      <div className="pagination-wrapper" style={{ marginLeft: "30%" }}>
        <Pagination
          aria-label="Page navigation example"
          itemClass="page-item"
          linkClass="page-link"
          prevPageText="Prev"
          nextPageText="Next"
          firstPageText="First"
          lastPageText="Last"
          activePage={activePage}
          itemsCountPerPage={limit}
          totalItemsCount={totalRecords}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

PaginationComponent.propTypes = {
  totalRecords: PropTypes.any,
  limit: PropTypes.any,
  activePage: PropTypes.any,
  getAllData: PropTypes.any
};

export default PaginationComponent;
