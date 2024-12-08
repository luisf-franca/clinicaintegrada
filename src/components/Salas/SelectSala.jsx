import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetSalas from '../../functions/Salas/GetSalas';

const SelectSala = ({ especialidade, onSelectSala }) => {
    const [salas, setSalas] = useState([]);

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const data = await GetSalas({ filter: `especialidade=${especialidade}` });
                console.log('Salas:', data);
                setSalas(data);
            } catch (error) {
                console.error('Erro ao buscar salas:', error);
            }
        };

        fetchSalas();
    }, [especialidade]);

    return (
        <div className="sala">
            <select onChange={(e) => onSelectSala(e.target.value)}>
                {/* <option value="">Selecione uma sala</option> */}
                {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                        {sala.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectSala;