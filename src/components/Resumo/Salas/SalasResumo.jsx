import React, { useState, useEffect } from 'react';
import './SalasResumo.css';
import { useNavigate } from 'react-router-dom';

// FUNCTIONS
import GetSalas from '../../../functions/Salas/GetSalas';
import BloquearDesbloquearSala from '../../../functions/Salas/BloquearDesbloquearSala';

const SalasResumo = ({ especialidade }) => {
    const [salas, setSalas] = useState([]); // Lista de salas
    const [salaSelecionada, setSalaSelecionada] = useState(null); // Sala atualmente selecionada
    const navigate = useNavigate(); // Hook para navegação

    // Busca salas com base na especialidade
    const fetchSalas = async () => {
        try {
            const filters = especialidade ? `especialidade=${especialidade}` : null;
            const response = await GetSalas({ filter: filters });
            setSalas(response); // Atualiza o estado com as salas retornadas
        } catch (error) {
            console.error('Erro ao buscar salas:', error);
        }
    };

    useEffect(() => {
        fetchSalas();
    }, [especialidade]);

    // Atualiza a sala selecionada com base na escolha no select
    const handleSelecionarSala = (e) => {
        const salaId = e.target.value;
        setSalaSelecionada(salas.find((sala) => sala.id === salaId));
    };

    // Alterna o status de disponibilidade da sala utilizando a API
    const handleBloquearDesbloquear = async () => {
        if (!salaSelecionada) return;

        try {
            // Chama a função de bloqueio/desbloqueio
            await BloquearDesbloquearSala(salaSelecionada.id);

            // Atualiza a sala selecionada diretamente após a operação
            setSalaSelecionada((prevSala) => ({
                ...prevSala,
                isDisponivel: !prevSala.isDisponivel, // Altera o status da sala
            }));

            // Não é necessário recarregar as salas, já que só precisamos atualizar a salaSelecionada
        } catch (error) {
            console.error('Erro ao bloquear/desbloquear sala:', error);
        }
    };

    // Navega para a tela de salas
    const handleNavigateSalas = () => {
        navigate('/sala'); // Navegação sem query string
    }

    return (
        <div className="salas-resumo">
            {/* Header com título */}
            <div className="salas-resumo__header">
                <h4>Salas</h4>
                <button onClick={handleNavigateSalas}>Novo Registro</button>
            </div>
    
            {/* Corpo do resumo */}
            <div className="salas-resumo__body">
                {/* Verifica se há salas cadastradas */}
                {salas.length === 0 ? (
                    <p>Nenhuma sala cadastrada para essa especialidade.</p>
                ) : (
                    <>
                        {/* Select para escolher a sala */}
                        <div className="salas-resumo__select">
                            <label htmlFor="salas-select">Escolha uma sala:</label>
                            <select
                                id="salas-select"
                                onChange={handleSelecionarSala}
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Selecione uma sala
                                </option>
                                {salas.map((sala) => (
                                    <option key={sala.id} value={sala.id}>
                                        {sala.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
    
                        {/* Botão para bloquear/desbloquear */}
                        <div className="salas-resumo__actions">
                            <button
                                onClick={handleBloquearDesbloquear}
                                disabled={!salaSelecionada}
                            >
                                {salaSelecionada?.isDisponivel
                                    ? 'Bloquear Sala'
                                    : 'Desbloquear Sala'}
                            </button>
                        </div>
    
                        {/* Status da sala */}
                        {salaSelecionada && (
                            <div className="salas-resumo__status">
                                <p>
                                    Sala selecionada: <strong>{salaSelecionada.nome}</strong>
                                </p>
                                <p>
                                    Status:{' '}
                                    <strong>
                                        {salaSelecionada.isDisponivel ? 'Desbloqueada' : 'Bloqueada'}
                                    </strong>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
    
};

export default SalasResumo;
