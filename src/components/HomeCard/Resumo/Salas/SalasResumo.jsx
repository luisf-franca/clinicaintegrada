import React, { useState } from 'react';
import './SalasResumo.css';

const SalasResumo = () => {
    const [salas, setSalas] = useState([
        { id: 1, nome: 'Sala 1', bloqueada: false },
        { id: 2, nome: 'Sala 2', bloqueada: true },
        { id: 3, nome: 'Sala 3', bloqueada: false },
    ]); // Lista de salas
    const [salaSelecionada, setSalaSelecionada] = useState(null); // Sala atualmente selecionada

    const handleSelecionarSala = (e) => {
        const salaId = parseInt(e.target.value, 10);
        setSalaSelecionada(salas.find((sala) => sala.id === salaId));
    };

    const handleBloquearDesbloquear = () => {
        if (!salaSelecionada) return;

        setSalas((prevSalas) =>
            prevSalas.map((sala) =>
                sala.id === salaSelecionada.id
                    ? { ...sala, bloqueada: !sala.bloqueada }
                    : sala
            )
        );

        setSalaSelecionada((prevSala) => ({
            ...prevSala,
            bloqueada: !prevSala.bloqueada,
        }));
    };

    return (
        <div className="salas-resumo">
            {/* Header com título */}
            <div className="salas-resumo__header">
                <h4>Salas</h4>
            </div>

            {/* Corpo do resumo */}
            <div className="salas-resumo__body">
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
                        {salaSelecionada?.bloqueada
                            ? 'Desbloquear Sala'
                            : 'Bloquear Sala'}
                    </button>
                </div>

                {/* Status da sala */}
                {salaSelecionada && (
                    <div className="salas-resumo__status">
                        <p>
                            Sala selecionada: <strong>{salaSelecionada.nome}</strong>
                        </p>
                        <p>
                            Status:{" "}
                            <strong>
                                {salaSelecionada.bloqueada ? 'Bloqueada' : 'Desbloqueada'}
                            </strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalasResumo;
