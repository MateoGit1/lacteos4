const config = {
  apiUrl: import.meta.env.PROD 
    ? 'lacteos2-production.up.railway.app'
    : 'http://localhost:3001/api'
};

export default config;