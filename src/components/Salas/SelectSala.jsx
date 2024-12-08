import React, { useState, useEffect } from 'react';

// FUNCTIONS
import GetSalas from '../../functions/Salas/GetSalas';

const SelectSala = ({ especialidade, onSelectSala }) => {
    const [salas, setSalas] = useState([]);

    const getEspecialidade = () => {
        switch (especialidade) {
            case 1:
                return 'psicologia';
            case 2:
                return 'fisioterapia';
            case 3:
                return 'odontologia';
            case 4:
                return 'nutrição';
            default:
                return null;
        }
    }

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const data = await GetSalas({ filter: `especialidade=${especialidade}` });
                onSelectSala(data[0]?.id ?? null);
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
                {salas.length === 0 ? (
                    <option value={null}>Nenhuma sala disponível para {getEspecialidade()}</option>
                ) : null}
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