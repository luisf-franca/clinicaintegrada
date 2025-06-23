import React, { useState, useEffect, useMemo } from 'react'; // Adicionado useMemo
import '../styles/agendamento.css';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import AgendamentoModal from '../components/AgendamentoModal/AgendamentoModal';
import AgendamentoDetails from '../components/AgendamentoDetails/AgendamentoDetails';
import SelectSala from '../components/Salas/SelectSala';

// FUNCTIONS
import GetAgendamentos from '../functions/Agendamentos/GetAgendamentos';
import DeleteAgendamento from '../functions/Agendamentos/DeleteAgendamento';
import GetAgendamentoById from '../functions/Agendamentos/GetAgendamentoById';

const Agendamento = () => {
  const [reloadAgendamentos, setReloadAgendamentos] = useState(false);
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    localStorage.getItem('selectedSpecialty') || 1,
  );
  const [selectedSala, setSelectedSala] = useState(null);
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
  const [selectedSlotForDelete, setSelectedSlotForDelete] = useState(null);
  const navigate = useNavigate();

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
    // Adiciona o último horário para fechar o intervalo final
    slots.push('22:00');
    return slots;
  };

  const [timeSlots] = useState(generateTimeSlots());

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        let filters = [];
        if (selectedSpecialty)
          filters.push(`especialidade=${selectedSpecialty}`);
        if (selectedSala) filters.push(`salaId=${selectedSala}`);
        if (tipo) filters.push(`tipo=${tipo}`);
        if (status) filters.push(`status=${status}`);

        const agendamentos = await GetAgendamentos({
          filter: filters.join(','),
        });
        console.log('agendamentos', agendamentos);
        const processedSlots = {};

        agendamentos.forEach((agendamento) => {
          const startTime = new Date(agendamento.dataHoraInicio);
          const endTime = new Date(agendamento.dataHoraFim);
          const dayLabel = startTime.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          });

          const startSlotIndex = timeSlots.findIndex(
            (time) =>
              time ===
              `${startTime.getHours().toString().padStart(2, '0')}:${startTime
                .getMinutes()
                .toString()
                .padStart(2, '0')}`,
          );
          const endSlotIndex = timeSlots.findIndex(
            (time) =>
              time ===
              `${endTime.getHours().toString().padStart(2, '0')}:${endTime
                .getMinutes()
                .toString()
                .padStart(2, '0')}`,
          );

          if (startSlotIndex === -1 || endSlotIndex === -1) return;

          if (!processedSlots[dayLabel]) processedSlots[dayLabel] = {};

          // ### CORREÇÃO PRINCIPAL ###
          // O loop agora usa '<' em vez de '<=' para não incluir a célula do horário de término.
          for (let i = startSlotIndex; i < endSlotIndex; i++) {
            processedSlots[dayLabel][timeSlots[i]] = {
              nome: agendamento.nome,
              agendamentoId: agendamento.id,
            };
          }
        });

        setSelectedSlots(processedSlots);
        setSelectedSlotForDelete(null);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };
    fetchAgendamentos();
  }, [selectedSpecialty, reloadAgendamentos, selectedSala, tipo, status, timeSlots]);


  // ### MELHORIA DE PERFORMANCE ###
  // useMemo evita que a lista de dias seja recalculada a cada renderização.
  const daysForWeek = useMemo(() => {
    const today = new Date();
    // Ajusta o início da semana para o dia atual, deslocado pela currentWeek
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + currentWeek * 7));

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
    setSelectedSlotForDelete(null);

    if (isSelected(dayObject.label, time)) return;
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
        if (isSelected(currentDay.label, slot)) {
            return; // Impede a seleção sobreposta
        }
    }

    setCurrentRange(newRange);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // MODIFICAÇÃO: Apenas abre o modal se 2 ou mais slots forem selecionados.
      if (currentRange.length >= 2) {
        handleOpenModal();
      } 
      
    }
    setIsDragging(false);
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
    }));

    setIsModalOpen(true);
  };

  const handleDeleteProcedure = async () => {
    if (!selectedSlotForDelete || selectedSlotForDelete.length === 0) {
      return;
    }

    const agendamentoId =
      selectedSlots[selectedSlotForDelete[0].day][selectedSlotForDelete[0].time]
        .agendamentoId;

    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir o agendamento?',
    );
    if (confirmDelete) {
      try {
        await DeleteAgendamento(agendamentoId);
        setSelectedSlotForDelete(null);
        handleReloadAgendamentos();
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
      }
    }
  };

  const isSelected = (dayLabel, time) => selectedSlots[dayLabel]?.[time];

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  const handleSlotClick = (dayLabel, time) => {
    if (isSelected(dayLabel, time)) {
      // ADIÇÃO: Limpa qualquer seleção de novo horário pendente.
      setCurrentRange([]);

      const agendamentoId = selectedSlots[dayLabel][time].agendamentoId;

      const slotsToDelete = [];
      Object.keys(selectedSlots).forEach((dayKey) => {
        Object.keys(selectedSlots[dayKey]).forEach((timeKey) => {
          if (selectedSlots[dayKey][timeKey].agendamentoId === agendamentoId) {
            slotsToDelete.push({ day: dayKey, time: timeKey });
          }
        });
      });

      setSelectedSlotForDelete(slotsToDelete);
    } else {
      setSelectedSlotForDelete(null);
    }
  };

  const handleReloadAgendamentos = () => {
    setReloadAgendamentos((prev) => !prev);
    // Limpa a seleção e o range visual após o agendamento
    setCurrentRange([]);
    setCurrentDay(null);
  };

  const handleNavigateConsulta = async () => {
    const agendamentoId =
      selectedSlots[selectedSlotForDelete[0].day][selectedSlotForDelete[0].time]
        .agendamentoId;
    try {
      const agendamento = await GetAgendamentoById(agendamentoId);
      navigate(`/consulta?consultaId=${agendamento.data.consultaId}`);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
    }
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
                <div className="especialidade">
                    <select
                        value={status || ''}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value={1}>Reservados</option>
                        <option value={2}>Concluídos</option>
                    </select>
                </div>
                <div className="especialidade">
                    <select value={tipo || ''} onChange={(e) => setTipo(e.target.value)}>
                        <option value="">Todos</option>
                        <option value={1}>Triagens</option>
                        <option value={2}>Consultas</option>
                    </select>
                </div>
                <SelectSala
                    especialidade={selectedSpecialty}
                    onSelectSala={setSelectedSala}
                />
            </div>
            <Especialidade
                selectedSpecialty={selectedSpecialty}
                onSelectSpecialty={setSelectedSpecialty}
            />
        </div>
      </hgroup>

      <nav>
        {selectedSlotForDelete === null && currentRange.length > 0 && (
          <button
            onClick={handleOpenModal}
            disabled={currentRange.length === 0}
          >
            Agendar
          </button>
        )}

        {selectedSlotForDelete && (
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
            {timeSlots.map((time, index) =>
              // Não renderiza a linha para as 22:00, que é apenas um delimitador
              time === '22:00' ? null : (
              <tr key={index}>
                <td>{time}</td>
                {daysForWeek.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`${
                      isSelected(day.label, time) ? 'selected' : ''
                    } ${
                      currentRange.includes(time) &&
                      currentDay?.label === day.label
                        ? 'dragging'
                        : ''
                    } ${
                      selectedSlotForDelete?.some(
                        (slot) =>
                          slot.day === day.label &&
                          slot.time === time,
                      )
                        ? 'dragging' // Reutiliza a classe 'dragging' para destacar a seleção
                        : ''
                    }`}
                    onMouseDown={() => handleMouseDown(day, time)} // Passa o objeto 'day' completo
                    onMouseEnter={() => handleMouseEnter(time)}
                    onClick={() => handleSlotClick(day.label, time)}
                  >
                    {isSelected(day.label, time) && (
                      <div className="procedure">
                        {selectedSlots[day.label][time].nome}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
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