import React, { useState, useEffect } from "react";
import "./listaEsperaCard.css";

// COMPONENTS
import PesquisarRegistros from "./ListaEspera/PesquisarRegistros";
import GetListaEntries from "../../functions/ListaEspera/GetListaEntries";

const ListaEsperaCard = () => {
  const [selectedComponent, setSelectedComponent] = useState("Pesquisar");
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState({});

  // Função para atualizar os registros
  const atualizarRegistros = () => {
    const options = {
      pageSize: 10,
      page: 1,
    };

    GetListaEntries(options)
      .then((data) => {
        setRegistros(data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar registros:", error);
      });
  };

  const handleDeleteRegistro = (id) => {
    setRegistros((prev) => prev.filter((registro) => registro.id !== id));
  };

  const handleRegistroClick = (registro) => {
    setRegistroSelecionado(registro);
  };

  useEffect(() => {
    atualizarRegistros();
  }, []);

  return (
    <div className="patient-card">
      <div className="patient-card-header">
        <h2>Lista de Espera</h2>
        <button onClick={() => setSelectedComponent("Adicionar")}>Adicionar Registro</button>
      </div>

      <div className="patient-card-body">
        <div className="pesquisar-pacientes">
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            <option value="Pesquisar">Pesquisar</option>
            <option value="Adicionar">Adicionar</option>
            <option value="Atualizar">Atualizar</option>
          </select>

           {/* {selectedComponent === "Pesquisar" && (
            <PesquisarRegistros setRegistros={setRegistros} />
          )} */}
          {/*
          {selectedComponent === "Adicionar" && (
            <AdicionarRegistro atualizarRegistros={atualizarRegistros} />
          )}
          {selectedComponent === "Atualizar" && (
            <AtualizarRegistro
              registroId={registroSelecionado.id}
              registroInicial={registroSelecionado}
              atualizarRegistros={atualizarRegistros}
            />
          )} */}
        </div>

        <div className="lista-pacientes">
          <table className="pacientes-table">
            <thead className="header-lista">
              <tr>
                <th>Data Entrada</th>
                <th>Data Saída</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Especialidade</th>
                {/* <th>ID Paciente</th> */}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="body-lista">
              {registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="paciente-item"
                  onClick={() => handleRegistroClick(registro)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      registroSelecionado.id === registro.id
                        ? "#f0f8ff"
                        : "transparent",
                  }}
                >
                  <td>{new Date(registro.dataEntrada).toLocaleString()}</td>
                  <td>
                    {registro.dataSaida
                      ? new Date(registro.dataSaida).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{registro.status}</td>
                  <td>{registro.prioridade}</td>
                  <td>{registro.especialidade}</td>
                  {/* <td>{registro.pacienteId}</td> */}
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRegistro(registro.id);
                      }}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaEsperaCard;
