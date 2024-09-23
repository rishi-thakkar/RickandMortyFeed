import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Layout, Typography, Row, Col, Select, Alert, Spin, Pagination } from 'antd';
import CharacterCard from './CharacterCard';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function App() {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [sortOption, setSortOption] = useState('name-asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Rick and Morty Feed';
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          status: statusFilter || undefined,
        }

        const response = await axios.get(
          'https://rickandmortyapi.com/api/character', { params }
        );

        setCharacters(response.data.results);
        setInfo(response.data.info);
        setLoading(false);
      } catch (err) {
        setError('Failed to load characters. Please try again.');
        setCharacters([]);
        setInfo({});
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage, statusFilter]);

  const sortedCharacters = useMemo(() => {
    let sorted = [...characters];

    if (sortOption === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'date-asc') {
      sorted.sort((a, b) => new Date(a.created) - new Date(b.created));
    } else if (sortOption === 'date-desc') {
      sorted.sort((a, b) => new Date(b.created) - new Date(a.created));
    }
    
    return sorted
  }, [characters, sortOption]);
    
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <Header>
        <Title style={{ color: 'white', marginTop: '14px' }} level={3}>
          Rick and Morty Characters
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        {/* Error Handling */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {/* Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px'}}>
          <Col xs={24} sm={12}>
            <label style={{ marginRight: '10px' }}>Sort By:</label>
            <Select
              value={sortOption}
              onChange={(value) => setSortOption(value)}
              style={{ width: '200px' }}
            >
              <Option value="name-asc">Name (A - Z)</Option>
              <Option value="name-desc">Name (Z - A)</Option>
              <Option value="date-asc">Date Created (Oldest First)</Option>
              <Option value="date-desc">Date Created (Newest First)</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12}>
            <label style={{ marginRight: '10px' }}>Filter by Status:</label>
            <Select
              value={statusFilter}
              onChange={onFilterChange}
              style={{ width: '200px' }}
            >
              <Option value="">All</Option>
              <Option value="alive">Alive</Option>
              <Option value="dead">Dead</Option>
              <Option value="unknown">Unknown</Option>
            </Select>
          </Col>
        </Row>


        {/* Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', margin: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Character Cards */}
            <Row gutter={[16, 16]}>
              {sortedCharacters.length > 0 ? (
                sortedCharacters.map((char) => (
                  <Col key={char.id} xs={24} sm={12} md={8} lg={6}>
                    <CharacterCard character={char} />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Alert
                    message="No characters found."
                    type="info"
                    showIcon
                  />
                </Col>
              )}
            </Row>

            {/* Pagination */}
            {info.pages && (
              <div style={{textAlign: "center", marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  current={currentPage}
                  total={info.count}
                  pageSize={20}
                  onChange={onPageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
}

export default App;
