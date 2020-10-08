import React, { useState, useEffect } from "react";

import "./styles.css";
import api from "./services/api";

function App() {
  const [ repos, setRepos ] = useState([]);

  // Listar os repositórios
  useEffect(() => {
    api.get('repositories')
    .then(response => setRepos(response.data))
  }, [])

  // Adicionar novos repositórios
  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Novo repo ${repos.length + 1}`,
      url: 'http://github.com/cassiogroh/conceitos-ReactJS',
      techs: ['React', 'ReactJS', 'React Native'],
    });
    const newRepo = response.data;
    setRepos([ ...repos, newRepo ])
  }

  // Deletar um repositório
  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    const repoIndex = repos.findIndex(repo => repo.id === id)
    const reposArray = [ ...repos ]; // Cópia para imutabilidade do estado
    reposArray.splice(repoIndex, 1);
    setRepos(reposArray);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repos.map(repo=>

          <li key={repo.id}>

            {repo.title}

            <button onClick={() => handleRemoveRepository(repo.id)}>
              Remover
            </button>
          </li>
          
        )}

      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
