import React, { useState, useEffect } from 'react';
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
  const [currentDay, setCurrentDay] = useState(null);
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
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

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

          if (!processedSlots[dayLabel]) processedSlots[dayLabel] = {};

          for (let i = startSlotIndex; i <= endSlotIndex; i++) {
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
  }, [selectedSpecialty, reloadAgendamentos, selectedSala, tipo, status]);

  const generateDaysForWeek = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + weekOffset * 7); // Ajusta para a semana desejada

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
  };

  const getDaysForWeek = () => {
    return generateDaysForWeek(currentWeek);
  };

  const handleMouseDown = (day, time) => {
    setIsDragging(true);
    setCurrentDay(day);
    setStartSlot(time);
    setCurrentRange([time]);
  };

  const handleMouseEnter = (time) => {
    if (!isDragging || currentDay === null || startSlot === null) return;

    const startIndex = timeSlots.indexOf(startSlot);
    const endIndex = timeSlots.indexOf(time);

    // Ensure valid indices
    if (startIndex === -1 || endIndex === -1) return;

    // Update currentRange based on dragging direction
    const newRange = timeSlots.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1, // include the end slot
    );

    // console.log('New range:', newRange);

    setCurrentRange(newRange);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOpenModal = () => {
    if (currentRange.length === 0) return;

    const [day, month] = currentDay.split('/').map((v) => parseInt(v, 10));

    // Get the first and last slots from the currentRange
    const firstSlot = currentRange[0];
    const lastSlot = currentRange[currentRange.length - 1];

    // Parse the hours and minutes from the first and last slots
    const [startHour, startMinute] = firstSlot
      .split(':')
      .map((v) => parseInt(v, 10));
    // Para o horário final, pegamos o próximo slot após o último selecionado
    let endSlotIndex = timeSlots.indexOf(lastSlot) + 1;
    // Se passar do último slot do dia, mantemos o último slot
    if (endSlotIndex >= timeSlots.length) endSlotIndex = timeSlots.length - 1;
    const [endHour, endMinute] = timeSlots[endSlotIndex]
      .split(':')
      .map((v) => parseInt(v, 10));

    const startDate = new Date();
    startDate.setDate(day);
    startDate.setMonth(month - 1); // Meses em JavaScript são baseados em zero (Janeiro é 0, Dezembro é 11)
    startDate.setHours(startHour);
    startDate.setMinutes(startMinute);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    // Calculate endDate diretamente do slot seguinte ao último selecionado
    const endDate = new Date(startDate);
    endDate.setHours(endHour);
    endDate.setMinutes(endMinute);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);

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

  // const handleSaveModal = () => {
  //   if (modalData.procedure.trim()) {
  //     setSelectedSlots((prev) => ({
  //       ...prev,
  //       [currentDay]: {
  //         ...prev[currentDay],
  //         ...Object.fromEntries(
  //           currentRange.map((slot) => [slot, modalData.procedure]),
  //         ),
  //       },
  //     }));
  //   }
  //   setIsModalOpen(false);
  //   setModalData({
  //     patientName: '',
  //     interns: '',
  //     procedure: '',
  //     observations: '',
  //     startSlot: '',
  //     endSlot: '',
  //   });
  //   setCurrentDay(null);
  //   setStartSlot(null);
  //   setCurrentRange([]);
  // };

  const handleDeleteProcedure = async () => {
    if (!selectedSlotForDelete || selectedSlotForDelete.length === 0) {
      // alert('Nenhum slot selecionado para exclusão.');
      return;
    }

    // Obter o ID do agendamento do primeiro slot selecionado
    const agendamentoId =
      selectedSlots[selectedSlotForDelete[0].day][selectedSlotForDelete[0].time]
        .agendamentoId;
    // console.log('Agendamento ID:', agendamentoId);

    // Confirmar exclusão
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir o agendamento?',
    );
    if (confirmDelete) {
      try {
        await DeleteAgendamento(agendamentoId);
        // alert('Agendamento deletado com sucesso!');
        setSelectedSlotForDelete(null);
        handleReloadAgendamentos();
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        // alert('Erro ao deletar agendamento.');
      }
    } else {
      // alert('Ação cancelada.');
    }
  };

  const isSelected = (day, time) => selectedSlots[day]?.[time];

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  // const closeDetails = () => setIsDetailsOpen(false);

  const handleSlotClick = (day, time) => {
    if (isSelected(day, time)) {
      const agendamentoId = selectedSlots[day][time].agendamentoId;

      const slotsToDelete = [];
      // Encontrar todos os slots relacionados ao agendamento
      Object.keys(selectedSlots).forEach((dayKey) => {
        Object.keys(selectedSlots[dayKey]).forEach((timeKey) => {
          if (selectedSlots[dayKey][timeKey].agendamentoId === agendamentoId) {
            slotsToDelete.push({ day: dayKey, time: timeKey });
          }
        });
      });

      // Atualizar o estado dos slots a serem deletados
      // console.log('Slots a serem deletados:', slotsToDelete);
      setSelectedSlotForDelete(slotsToDelete);
    } else {
      // Limpar seleção se clicar fora de um agendamento
      setSelectedSlotForDelete(null);
    }
  };

  const handleReloadAgendamentos = () => {
    // console.log('Recarregando agendamentos...');
    setReloadAgendamentos((prev) => !prev);
  };

  // Função para navegar para a página de consulta
  const handleNavigateConsulta = async () => {
    const agendamentoId =
      selectedSlots[selectedSlotForDelete[0].day][selectedSlotForDelete[0].time]
        .agendamentoId;
    // consultar agendamento, obter consultaId e navegar para a página de consulta
    try {
      const agendamento = await GetAgendamentoById(agendamentoId);
      // console.log('Agendamento:', agendamento);
      // Navegar para a página de consulta
      navigate(`/consulta?consultaId=${agendamento.data.consultaId}`);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
    }
  };

  return (
    <div
      className="agendamento"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <hgroup>
        <h1>Agendamentos</h1>
        <SelectSala
          especialidade={selectedSpecialty}
          onSelectSala={setSelectedSala}
        />
        <Especialidade
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={setSelectedSpecialty}
        />
      </hgroup>

      {/* {isDetailsOpen && (
        <AgendamentoDetails modalData={modalData} closeDetails={closeDetails} />
      )} */}

      <nav>
        {selectedSlotForDelete === null && (
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

        <select
          value={status || ''}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value={1}>Reservados</option>
          <option value={2}>Concluídos</option>
          {/* <option value={3}>Cancelado</option> */}
        </select>

        <select value={tipo || ''} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value={1}>Triagens</option>
          <option value={2}>Consultas</option>
          {/* <option value={3}>Cancelado</option> */}
        </select>
      </nav>

      <div className="calendario-wrapper">
        <table>
          <thead>
            <tr>
              <th>Horários</th>
              {getDaysForWeek().map((day, index) => (
                <th key={index}>{day.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, index) => (
              <tr key={index}>
                <td>{time}</td>
                {getDaysForWeek().map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`${
                      isSelected(day.label, time) ? 'selected' : ''
                    } 
                              ${
                                currentRange.includes(time) &&
                                currentDay === day.label
                                  ? 'dragging'
                                  : ''
                              } 
                              ${
                                selectedSlotForDelete?.some(
                                  (slot) =>
                                    slot.day === day.label &&
                                    slot.time === time,
                                )
                                  ? 'dragging'
                                  : ''
                              }`}
                    onMouseDown={() => handleMouseDown(day.label, time)}
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
