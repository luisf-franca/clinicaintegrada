import React, { useState, useEffect } from 'react';
import './patientCard.css';

//COMPONENTS
import PesquisarPacientes from '../Pacientes/PesquisarPacientes';
import GetPacientes from '../../functions/Pacientes/GetPacientes';
import AdicionarPaciente from '../Pacientes/AdicionarPaciente';

const PatientCard = () => {

  const [selectedComponent, setSelectedComponent] = useState('Pesquisar');
  const [pacientes, setPacientes] = useState([
    {
      nome: "Ana Silva",
      telefone: "31985674523",
      idade: 12,
      nomeResponsavel: "Maria Silva",
      parentescoResponsavel: "Mãe",
      observacao: "Alergia a medicamentos",
      recebeuAlta: false,
    },
    {
      nome: "Carlos Souza",
      telefone: "31991237856",
      idade: 16,
      nomeResponsavel: "João Souza",
      parentescoResponsavel: "Pai",
      observacao: "Hipertensão arterial",
      recebeuAlta: true,
    },
    {
      nome: "Mariana Oliveira",
      telefone: "31983456219",
      idade: 28,
      nomeResponsavel: null,
      parentescoResponsavel: null,
      observacao: "Em acompanhamento pós-cirúrgico",
      recebeuAlta: false,
    },
    {
      nome: "João Santos",
      telefone: "31976543210",
      idade: 35,
      nomeResponsavel: null,
      parentescoResponsavel: null,
      observacao: "Diabetes tipo 2",
      recebeuAlta: true,
    },
    {
      nome: "Fernanda Costa",
      telefone: "31999876543",
      idade: 17,
      nomeResponsavel: "Pedro Costa",
      parentescoResponsavel: "Avô",
      observacao: "Consulta de rotina",
      recebeuAlta: false,
    },
    {
      nome: "Lucas Lima",
      telefone: "31982347856",
      idade: 13,
      nomeResponsavel: "Camila Lima",
      parentescoResponsavel: "Irmã",
      observacao: "Tratamento odontológico",
      recebeuAlta: false,
    },
    {
      nome: "Carla Pereira",
      telefone: "31984567812",
      idade: 7,
      nomeResponsavel: "Rodrigo Pereira",
      parentescoResponsavel: "Pai",
      observacao: "Acompanhamento nutricional",
      recebeuAlta: true,
    },
    {
      nome: "Ricardo Almeida",
      telefone: "31996781234",
      idade: 32,
      nomeResponsavel: null,
      parentescoResponsavel: null,
      observacao: "Exame de sangue agendado",
      recebeuAlta: false,
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await GetPacientes();
        setPacientes(items);
      }
      catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    }
    fetchData();
  }, []);

  
  return (
    <div className="patient-card">
      <div className="patient-card-header">
        <h2>Pacientes</h2>
        <button onClick={(e) => setSelectedComponent("Adicionar")}>Adicionar Paciente</button>
      </div>

      <div className="patient-card-body">
        <div className='pesquisar-pacientes'>
          <select value={selectedComponent} onChange={(e) => setSelectedComponent(e.target.value)}>
            <option value="Pesquisar">Pesquisar</option>
            <option value="Adicionar">Adicionar</option>
            <option value="Atualizar">Atualizar</option>
          </select>

          {selectedComponent === 'Pesquisar' && <PesquisarPacientes setPacientes={setPacientes} />}
          {selectedComponent === 'Adicionar' && <AdicionarPaciente />} { /* pendência: deve atualizar lista de pacientes ao cadastrar paciente */ }
          {selectedComponent === 'Atualizar' && <h1>Atualizar Paciente</h1>}

        </div>

        <div className='lista-pacientes'>
          <table className='pacientes-table'>
            <thead className='header-lista'>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Telefone</th>
                <th>Observação</th>
                <th>Recebeu Alta</th>
                <th>Nome Responsável</th>
                <th>Parentesco Responsável</th>
              </tr>
            </thead>
            <tbody className='body-lista'>
              {pacientes.map((paciente, index) => (
                <tr key={index} className="paciente-item">
                  <td>{paciente.nome}</td>
                  <td>{paciente.idade}</td>
                  <td>{paciente.telefone}</td>
                  <td>{paciente.observacao}</td>
                  <td>{paciente.recebeuAlta ? "Sim" : "Não"}</td>
                  <td>{paciente.nomeResponsavel}</td>
                  <td>{paciente.parentescoResponsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
