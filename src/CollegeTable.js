import React, { useState, useEffect, useCallback } from 'react';
import collegesData from './CollegesData';
import './CollegeTable.css'; 

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedColleges, setDisplayedColleges] = useState([]);

  useEffect(() => {
    setColleges(collegesData);
  }, []);

  useEffect(() => {
    setDisplayedColleges(collegesData.slice(0, 10));
  }, [colleges]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedColleges = useCallback(() => {
    return [...colleges].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [colleges, sortConfig]);

  const filteredColleges = useCallback(() => {
    return sortedColleges().filter((college) =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedColleges, searchTerm]);

  useEffect(() => {
    setDisplayedColleges(filteredColleges().slice(0, 10));
  }, [searchTerm, sortConfig, colleges]);

  const loadMoreColleges = () => {
    const newLength = displayedColleges.length + 10;
    const moreColleges = filteredColleges().slice(0, newLength);
    setDisplayedColleges(moreColleges);
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadMoreColleges();
    }
  }, [displayedColleges, filteredColleges]);

  const getIcon = () => {
    const icons = ['🎓', '📚', '🏫', '🎒', '📖'];
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  return (
    <div>
      <input
        type="text"
        className='mySearchBar'
        placeholder="Search by college name"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <div className="table-container" onScroll={handleScroll}>
        <table>
          <thead style={{ backgroundColor: '#ADD8E6', color: 'white' }}>
            <tr>
              <th onClick={() => handleSort('name')}>Table ID</th>
              <th onClick={() => handleSort('name')}>College Name</th>
              <th onClick={() => handleSort('rating')}>Rating</th>
              <th onClick={() => handleSort('fees')}>Fees</th>
              <th onClick={() => handleSort('userReview')}>User Review</th>
              <th>Featured</th>
            </tr>
          </thead>
          <tbody>
            {displayedColleges.map((college) => (
              <tr key={college.id}>
                <td>{college.id}</td>
                <td><span role="img" aria-label="icon">{getIcon()}</span> {college.name}</td>
                <td style={{ color: 'blue' }}>{college.rating}</td>
                <td style={{ color: 'blue' }}>{college.fees}</td>
                <td style={{ color: 'blue' }}>{college.userReview}</td>
                <td style={{ color: college.featured ? 'red' : 'blue' }}>{college.featured ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeTable;
