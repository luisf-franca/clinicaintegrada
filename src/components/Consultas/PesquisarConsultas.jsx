import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetConsultas from '../../functions/Consultas/GetConsultas';

const PesquisarConsultas = ({ setConsultas, especialidade }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [orderBy, setOrderBy] = useState('');
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (nome === '') {
            getConsultas();
        }
    }, [nome, especialidade]);

    const getConsultas = async () => {
        try {
            const options = {};

            let filters = [];
            if (nome !== '') filters.push(`PacienteNome^${nome}`);
            if (especialidade) filters.push(`Especialidade=${especialidade}`);

            if (filters.length > 0) options.filter = filters.join(',');

            if (page) options.page = page;
            if (pageSize) options.pageSize = pageSize;
            if (orderBy) options.orderBy = orderBy;

            const response = await GetConsultas(options);
            setConsultas(response);
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
        }
    }

    const handleNomeChange = (e) => {
        const { value } = e.target;
        setNome(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            getConsultas();
        }
    }

    const clearFilter = async () => {
        setNome('');
    }

    return (
        <div>
            <div>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={handleNomeChange}
                        onKeyDown={handleKeyDown}
                    />
                    {nome && (
                        <button
                            onClick={() => {
                                clearFilter();
                                setConsultas([]);
                            }}
                        >
                            Limpar
                        </button>
                    )}
                    <button onClick={getConsultas}>Buscar</button>
                </div>
            </div>
        </div>
    );
};

export default PesquisarConsultas;