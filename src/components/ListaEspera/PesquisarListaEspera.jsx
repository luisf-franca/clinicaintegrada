import { useState, useEffect, useRef } from 'react';
import GetListaEntries from '../../functions/ListaEspera/GetListaEntries';

const PesquisarListaEspera = ({
  especialidade,
  onSelectRegistro,
  registroSelecionado,
  onLimparRegistro,
  onNomeChange
}) => {
  const [nome, setNome] = useState('');
  const [debouncedNome, setDebouncedNome] = useState('');
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Notifica o componente pai sobre mudança no nome
  useEffect(() => {
    if (onNomeChange) {
      onNomeChange(nome);
    }
  }, [nome, onNomeChange]);

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNome(nome);
    }, 300);

    return () => clearTimeout(timer);
  }, [nome]);

  // Busca registros quando o nome debounced mudar ou quando o input recebe foco sem texto
  useEffect(() => {
    const buscarRegistros = async () => {
      if (!especialidade) {
        setRegistros([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const filters = [
          `especialidade=${especialidade}`,
          'status=1',
          `PacienteNome^${debouncedNome}`
        ];

        // Se há texto digitado, adiciona filtro de nome
        if (debouncedNome.trim()) {
          filters.push(`PacienteNome^${debouncedNome}`);
        }

        const response = await GetListaEntries({
          filter: filters.join(','),
          pageSize: debouncedNome.trim() ? 10 : 3 // 3 registros se não há texto, 10 se há
        });

        setRegistros(response?.items || []);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao buscar registros da lista de espera:', error);
        setRegistros([]);
      } finally {
        setIsLoading(false);
      }
    };

    buscarRegistros();
  }, [debouncedNome, especialidade]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNome(value);
    if (!value.trim()) {
      // Se não há texto, ainda mostra os 3 primeiros registros
      setShowResults(true);
    }
  };

  const handleSelectRegistro = (registro) => {
    onSelectRegistro(registro);
    setNome(registro.nome);
    setShowResults(false);
  };

  const handleLimparRegistro = () => {
    onLimparRegistro();
    setNome('');
    setShowResults(false);
  };

  const handleInputFocus = () => {
    // Sempre mostra resultados quando recebe foco
    setShowResults(true);
  };

  const handleInputBlur = () => {
    // Delay para permitir clique nos resultados
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <div className="pesquisar-lista-espera-form">
      <div className="form-group">
        <label htmlFor="nome-lista-espera">Nome do Paciente</label>
        <input
          id="nome-lista-espera"
          type="text"
          value={nome}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Digite o nome para buscar..."
          autoComplete="off"
          disabled={registroSelecionado}
        />

        {registroSelecionado && (
          <button
            type="button"
            onClick={handleLimparRegistro}
          >
            Limpar Paciente
          </button>
        )}
      </div>

      {showResults && (
        <div className="resultados-lista-espera">
          {isLoading ? (
            <div>Carregando...</div>
          ) : registros.length === 0 ? (
            <div>Nenhum registro encontrado</div>
          ) : (
            registros.map((registro) => (
              <div
                key={registro.id}
                onClick={() => handleSelectRegistro(registro)}
              >
                <div>{registro.nome}</div>
                <div>
                  Prioridade: {registro.prioridade} |
                  Entrada: {new Date(registro.dataEntrada).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PesquisarListaEspera; 