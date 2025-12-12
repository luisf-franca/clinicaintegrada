import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Adicionado useMemo
import '../styles/agendamento.css';
import { useNavigate, useLocation } from 'react-router-dom';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import AgendamentoModal from '../components/AgendamentoModal/AgendamentoModal';
import SelectSala from '../components/Salas/SelectSala';

// FUNCTIONS
import GetAgendamentos from '../functions/Agendamentos/GetAgendamentos';
import DeleteAgendamento from '../functions/Agendamentos/DeleteAgendamento';
import GetAgendamentoById from '../functions/Agendamentos/GetAgendamentoById';

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      slots.push(formattedTime);
    }
  }
  slots.push('22:00');
  return slots;
};

// Constante para evitar recriação
const TIME_SLOTS = generateTimeSlots();

const Agendamento = () => {
  const [reloadAgendamentos, setReloadAgendamentos] = useState(false);
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );
  const [selectedSala, setSelectedSala] = useState(null);
  const [currentSalaCapacity, setCurrentSalaCapacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDay, setCurrentDay] = useState(null); // Agora armazena o objeto do dia inteiro
  const [startSlot, setStartSlot] = useState(null);
  const [currentRange, setCurrentRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    pacienteId: '',
    startSlot: '',
    endSlot: '',
  });
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Substituir o useState(generateTimeSlots()) por:
  const timeSlots = TIME_SLOTS;

  // Lê parâmetros da URL para definir especialidade automaticamente
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const especialidadeParam = searchParams.get('especialidade');

    if (especialidadeParam) {
      const especialidadeId = parseInt(especialidadeParam, 10);
      if (!isNaN(especialidadeId)) {
        setSelectedSpecialty(especialidadeId);
        // Salva no localStorage para manter a seleção
        localStorage.setItem('selectedSpecialty', especialidadeId.toString());
      }
    }
  }, [location.search]);

  // 2. MELHORIA: Extrair lógica complexa de processamento de dados
  // Isso separa a busca de dados da regra de negócio de visualização
  const processAgendamentosToSlots = useCallback((agendamentosRaw) => {
    // Ordenação
    const agendamentos = agendamentosRaw.sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio));
    const processedSlots = {};
    const conflictMap = {}; // Auxiliar para conflitos

    agendamentos.forEach((agendamento) => {
      const startTime = new Date(agendamento.dataHoraInicio);
      const endTime = new Date(agendamento.dataHoraFim);

      const dayLabel = startTime.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      const startSlotStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
      const endSlotStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

      const startIndex = timeSlots.indexOf(startSlotStr);
      const endIndex = timeSlots.indexOf(endSlotStr);

      if (startIndex === -1 || endIndex === -1) return;

      if (!processedSlots[dayLabel]) processedSlots[dayLabel] = {};

      for (let i = startIndex; i < endIndex; i++) {
        const currentTime = timeSlots[i];
        if (!processedSlots[dayLabel][currentTime]) {
          processedSlots[dayLabel][currentTime] = [];
        }

        const slotList = processedSlots[dayLabel][currentTime];
        const exists = slotList.some(a => a.agendamentoId === agendamento.id);

        if (!exists) {
          slotList.push({
            nome: agendamento.nome,
            agendamentoId: agendamento.id,
          });

          // Contagem de conflitos
          const currentCount = slotList.length;
          conflictMap[agendamento.id] = Math.max(conflictMap[agendamento.id] || 0, currentCount);
        }
      }
    });

    // Injeção de maxConflict
    Object.keys(processedSlots).forEach(day => {
      Object.keys(processedSlots[day]).forEach(time => {
        processedSlots[day][time] = processedSlots[day][time].map(app => ({
          ...app,
          maxConflict: conflictMap[app.agendamentoId] || 1
        }));
      });
    });

    return processedSlots;
  }, [timeSlots]);

  // UseEffect agora fica muito mais limpo
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        let filters = [];
        if (selectedSpecialty) filters.push(`especialidade=${selectedSpecialty}`);
        if (selectedSala) filters.push(`salaId=${selectedSala}`);
        if (tipo) filters.push(`tipo=${tipo}`);
        if (status) filters.push(`status=${status}`);

        const agendamentosRaw = await GetAgendamentos({ filter: filters.join(',') });

        // Chamada da função extraída
        const processed = processAgendamentosToSlots(agendamentosRaw);

        setSelectedSlots(processed);
        setSelectedAgendamentoId(null);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };
    fetchAgendamentos();
  }, [selectedSpecialty, reloadAgendamentos, selectedSala, tipo, status, processAgendamentosToSlots]);


  // ### MELHORIA DE PERFORMANCE ###
  // useMemo evita que a lista de dias seja recalculada a cada renderização.
  const daysForWeek = useMemo(() => {
    const today = new Date();
    // Ajusta o início da semana para o dia atual, deslocado pela currentWeek
    // REMOVIDO: - today.getDay() para que comece HOJE e não no Domingo
    const startOfWeek = new Date(today.setDate(today.getDate() + currentWeek * 7));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        date: day,
        label: day.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
      });
    }
    return days;
  }, [currentWeek]);


  const handleMouseDown = (dayObject, time) => {
    // ADIÇÃO: Limpa a seleção de um agendamento anterior ao iniciar uma nova seleção.
    if (selectedAgendamentoId) setSelectedAgendamentoId(null);

    // Se estiver ocupado, só impede se estiver CHEIO
    const appointments = selectedSlots[dayObject.label]?.[time] || [];
    if (appointments.length >= currentSalaCapacity) return;

    setIsDragging(true);
    setCurrentDay(dayObject);
    setStartSlot(time);
    setCurrentRange([time]);
  };

  const handleMouseEnter = (time) => {
    if (!isDragging || currentDay === null || startSlot === null) return;

    const startIndex = timeSlots.indexOf(startSlot);
    const endIndex = timeSlots.indexOf(time);

    if (startIndex === -1 || endIndex === -1) return;

    const newRange = timeSlots.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1,
    );

    // Verifica se algum slot no novo intervalo já está ocupado
    for (const slot of newRange) {
      if (isSelectedFull(currentDay.label, slot)) {
        return; // Impede a seleção sobreposta se estiver CHEIO
      }
    }

    setCurrentRange(newRange);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // MODIFICAÇÃO: Apenas abre o modal se 2 ou mais slots forem selecionados.
      // OU se for apenas 1 slot mas a intenção for click-to-book (handled by click?)
      // Mantendo lógica original de drag >= 2
      if (currentRange.length >= 2) {
        handleOpenModal();
      }

    }
    setIsDragging(false);
  };

  const handleSpecialtyChange = (specialtyId) => {
    setSelectedSpecialty(specialtyId);
    // Limpa a sala selecionada para forçar a auto-seleção no componente SelectSala
    setSelectedSala(null);
    setCurrentSalaCapacity(1); // Reseta capacidade
  };

  const handleSelectSalaObj = (sala) => {
    // Atualiza capacidade quando sala é selecionada (via SelectSala)
    if (sala) {
      setCurrentSalaCapacity(sala.capacidade || 1);
    }
  };

  const handleOpenModal = () => {
    if (currentRange.length === 0 || !currentDay) return;

    const firstSlot = currentRange[0];
    const lastSlot = currentRange[currentRange.length - 1];

    const [startHour, startMinute] = firstSlot
      .split(':')
      .map((v) => parseInt(v, 10));

    let endSlotIndex = timeSlots.indexOf(lastSlot) + 1;
    // Garante que o índice não ultrapasse o final da lista
    if (endSlotIndex >= timeSlots.length) endSlotIndex = timeSlots.length - 1;

    const [endHour, endMinute] = timeSlots[endSlotIndex]
      .split(':')
      .map((v) => parseInt(v, 10));

    // ### MELHORIA DE ROBUSTEZ ###
    // Usa o objeto Date diretamente de `currentDay` em vez de reconstruí-lo
    const startDate = new Date(currentDay.date);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(currentDay.date);
    endDate.setHours(endHour, endMinute, 0, 0);

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    setModalData((prev) => ({
      ...prev,
      startSlot: formattedStart,
      endSlot: formattedEnd,
      salaId: selectedSala,
    }));

    setIsModalOpen(true);
  };

  // ALTERAÇÃO 3: Delete muito mais simples
  const handleDeleteProcedure = async () => {
    if (!selectedAgendamentoId) return;

    const confirmDelete = window.confirm('Tem certeza que deseja excluir o agendamento?');

    if (confirmDelete) {
      try {
        await DeleteAgendamento(selectedAgendamentoId); // Usa o ID direto
        setSelectedAgendamentoId(null);
        handleReloadAgendamentos();
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
      }
    }
  };

  const isSelected = (dayLabel, time) => {
    return selectedSlots[dayLabel]?.[time] && selectedSlots[dayLabel][time].length > 0;
  };

  const isSelectedFull = (dayLabel, time) => {
    const apps = selectedSlots[dayLabel]?.[time] || [];
    return apps.length >= currentSalaCapacity;
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  // ALTERAÇÃO 2: Handler de clique simplificado (Otimização Máxima)
  const handleAppointmentClick = (e, agendamentoId) => {
    e.stopPropagation(); // IMPORTANTE: Impede que o click passe para a célula (td)

    // Toggle: se já estiver selecionado, deseleciona. Se não, seleciona.
    setSelectedAgendamentoId(prev => (prev === agendamentoId ? null : agendamentoId));

    // Limpa qualquer range de drag que possa ter ficado residual
    setCurrentRange([]);
    setCurrentDay(null);
  };

  const handleReloadAgendamentos = () => {
    setReloadAgendamentos((prev) => !prev);
    // Limpa a seleção e o range visual após o agendamento
    setCurrentRange([]);
    setCurrentDay(null);
  };

  // ALTERAÇÃO 4: Navegação direta pelo ID
  const handleNavigateConsulta = async () => {
    if (!selectedAgendamentoId) return;

    try {
      const agendamento = await GetAgendamentoById(selectedAgendamentoId);
      navigate(`/consulta?consultaId=${agendamento.data.consultaId}&tab=1`);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
    }
  };

  // 3. MELHORIA: Função auxiliar para limpar o JSX (Renderização Condicional)
  // 1. Função ajustada: cuida apenas da célula (arrastar para criar ou seleção vazia)
  const getCellClassName = (dayLabel, time) => {
    const classes = [];

    // Verifica apenas DRAG (criação)
    const isDraggingCell = currentRange.includes(time) && currentDay?.label === dayLabel;
    if (isDraggingCell) classes.push('dragging');

    // Verifica se a célula tem itens (para bordas, se quiser manter)
    if (isSelected(dayLabel, time)) classes.push('has-items');

    return classes.join(' ');
  };

  return (
    <div
      className="agendamento container"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <hgroup>
        <h1>Agendamentos</h1>
        <div className="filtros-container">
          <div className="filtros-secundarios">

            {/* Filtro de Status */}
            <div className="filtro-wrapper">
              <label>Status</label>
              <select
                value={status || ''}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value={1}>Reservados</option>
                <option value={2}>Concluídos</option>
              </select>
            </div>

            {/* Filtro de Tipo */}
            <div className="filtro-wrapper">
              <label>Tipo de Agendamento</label>
              <select value={tipo || ''} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos</option>
                <option value={1}>Triagens</option>
                <option value={2}>Consultas</option>
              </select>
            </div>

            {/* Filtro de Sala */}
            <div className="filtro-wrapper">
              <label>Sala</label>
              <SelectSala
                especialidade={selectedSpecialty}
                onSelectSala={setSelectedSala}
                onSelectSalaObj={handleSelectSalaObj}
                selectedSala={selectedSala}
              />
            </div>
          </div>

          {/* Filtro de Especialidade */}
          <div className="filtro-wrapper">
            <label>Especialidade</label>
            <Especialidade
              selectedSpecialty={selectedSpecialty}
              onSelectSpecialty={handleSpecialtyChange}
            />
          </div>
        </div>
      </hgroup>

      <nav>
        {/* Lógica do botão Agendar (mantida) */}
        {((!selectedAgendamentoId && currentRange.length > 0)) && (
          <button onClick={handleOpenModal}>Agendar</button>
        )}

        {/* Lógica dos botões de ação (Agora baseada no ID) */}
        {selectedAgendamentoId && (
          <>
            <button onClick={handleNavigateConsulta}>Ver Detalhes</button>
            <button onClick={handleDeleteProcedure}>Excluir</button>
          </>
        )}

        <button onClick={handlePreviousWeek}>← Semana Anterior</button>
        <button onClick={handleNextWeek}>Próxima Semana →</button>
      </nav>

      <div className="calendario-wrapper">
        <table>
          <thead>
            <tr>
              <th>Horários</th>
              {daysForWeek.map((day, index) => (
                <th key={index}>{day.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) =>
              time === '22:00' ? null : (
                <tr key={time}>
                  <td>{time}</td>
                  {daysForWeek.map((day) => (
                    <td
                      key={`${day.label}-${time}`}
                      className={getCellClassName(day.label, time)}
                      onMouseDown={() => handleMouseDown(day, time)}
                      onMouseEnter={() => handleMouseEnter(time)}
                      // Se clicar na célula branca, limpa a seleção do agendamento
                      onClick={() => setSelectedAgendamentoId(null)}
                    >
                      {isSelected(day.label, time) && (
                        <div className="procedures-container">
                          {selectedSlots[day.label][time].map((agendamento, idx) => {

                            // AQUI ESTÁ A MÁGICA: Comparação simples de ID
                            const isActive = agendamento.agendamentoId === selectedAgendamentoId;

                            return (
                              <div
                                key={idx}
                                className={`procedure item-${idx} ${isActive ? 'selected' : ''}`}
                                // Passamos o ID direto no click
                                onClick={(e) => handleAppointmentClick(e, agendamento.agendamentoId)}
                                style={{ flex: '1', minWidth: 0 }}
                              >
                                {agendamento.nome}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AgendamentoModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalData={modalData}
          atualizarRegistros={handleReloadAgendamentos}
        />
      )}
    </div>
  );
};

export default Agendamento;