import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Layout, Typography, Row, Col, Select, Alert, Spin } from 'antd';
import CharacterCard from './CharacterCard';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function App() {
  const [characters, setCharacters] = useState([]);
  const [sortedCharacters, setSortedCharacters] = useState([]);
  const [sortOption, setSortOption] = useState('name-asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        let allCharacters = [];
        let next = 'https://rickandmortyapi.com/api/character';
        while (next) {
          const response = await axios.get(next);
          const data = await response.data;
          allCharacters.push(...data.results);
          next = response.data.info.next;
        }
        setCharacters(allCharacters);
        setLoading(false);
      } catch (err) {
        // HANDLE ERROR
        setError('Failed to load characters. Please try again later.');
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    let filteredCharacters = [...characters];

    // Filtering
    if (statusFilter !== 'all') {
      filteredCharacters = filteredCharacters.filter(
        (char) => char.status.toLowerCase() === statusFilter
      );
    }

    if (sortOption === 'name-asc') {
      filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      filteredCharacters.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'date-asc') {
      filteredCharacters.sort((a, b) => a.created - b.created);
    } else if (sortOption === 'date-desc') {
      filteredCharacters.sort((a, b) => b.created - a.created);
    }
    
    setSortedCharacters(filteredCharacters);
  }, [characters, sortOption, statusFilter]);

 
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

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', margin: '20px' }}>
            <Spin size="large" />
          </div>
        )}

        {/* Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
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
              onChange={(value) => setStatusFilter(value)}
              style={{ width: '200px' }}
            >
              <Option value="all">All</Option>
              <Option value="alive">Alive</Option>
              <Option value="dead">Dead</Option>
              <Option value="unknown">Unknown</Option>
            </Select>
          </Col>
        </Row>

        {/* Character Cards */}
        {!loading && (
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
        )}
      </Content>
    </Layout>
  );
}

export default App;
