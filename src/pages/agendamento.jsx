import React, { useState, useEffect } from 'react';
import '../styles/agendamento.css';

// COMPONENTS
import Especialidade from '../components/Especialidade/Especialidade';
import AgendamentoModal from '../components/AgendamentoModal/AgendamentoModal';
import AgendamentoDetails from '../components/AgendamentoDetails/AgendamentoDetails';
import SelectSala from '../components/Salas/SelectSala';

// FUNCTIONS
import GetAgendamentos from '../functions/Agendamentos/GetAgendamentos';
import DeleteAgendamento from '../functions/Agendamentos/DeleteAgendamento';


const Agendamento = () => {
  const [reloadAgendamentos, setReloadAgendamentos] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [selectedSpecialty, setSelectedSpecialty] = useState(1);
  const [selectedSala, setSelectedSala] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [startSlot, setStartSlot] = useState(null);
  const [currentRange, setCurrentRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    patientName: '',
    interns: '',
    procedure: '',
    observations: '',
  });
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlotForDelete, setSelectedSlotForDelete] = useState(null);

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
        const agendamentos = await GetAgendamentos({ filter: `especialidade=${selectedSpecialty},salaId=${selectedSala}` });
        const processedSlots = {};

        agendamentos.forEach((agendamento) => {
          const startTime = new Date(agendamento.dataHoraInicio);
          const endTime = new Date(agendamento.dataHoraFim);
          const dayLabel = startTime.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          });

          const startSlotIndex = timeSlots.findIndex(
            (time) => time === `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`
          );
          const endSlotIndex = timeSlots.findIndex(
            (time) => time === `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`
          );

          if (!processedSlots[dayLabel]) processedSlots[dayLabel] = {};

          for (let i = startSlotIndex; i <= endSlotIndex; i++) {
            processedSlots[dayLabel][timeSlots[i]] = {
              nome: agendamento.nome,
              agendamentoId: agendamento.id
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
  }, [selectedSpecialty, reloadAgendamentos, selectedSala]);

  const generateDaysForWeek = (weekOffset) => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7),
    );
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
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

    if (startIndex === -1 || endIndex === -1) return;

    const range = timeSlots.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1,
    );

    setCurrentRange(range);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOpenModal = () => {
    if (currentRange.length === 0) return;

    const start = currentRange[0];
    const end = currentRange[currentRange.length - 1];

    const endHour = parseInt(end.split(':')[0]);
    const endMinute = parseInt(end.split(':')[1]);
    const adjustedEndTime = new Date(0, 0, 0, endHour, endMinute + 15);

    const formattedEnd = `${adjustedEndTime
      .getHours()
      .toString()
      .padStart(2, '0')}:${adjustedEndTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    setModalData((prev) => ({
      ...prev,
      procedure: '',
      startSlot: start,
      endSlot: formattedEnd,
    }));

    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (modalData.procedure.trim()) {
      setSelectedSlots((prev) => ({
        ...prev,
        [currentDay]: {
          ...prev[currentDay],
          ...Object.fromEntries(
            currentRange.map((slot) => [slot, modalData.procedure]),
          ),
        },
      }));
    }
    setIsModalOpen(false);
    setModalData({
      patientName: '',
      interns: '',
      procedure: '',
      observations: '',
      startSlot: '',
      endSlot: '',
    });
    setCurrentDay(null);
    setStartSlot(null);
    setCurrentRange([]);
  };

  const handleDeleteProcedure = async () => {
    if (!selectedSlotForDelete || selectedSlotForDelete.length === 0) {
      alert('Nenhum slot selecionado para exclusão.');
      return;
    }
  
    // Obter o ID do agendamento do primeiro slot selecionado
    const agendamentoId = selectedSlots[selectedSlotForDelete[0].day][selectedSlotForDelete[0].time].agendamentoId;
    console.log('Agendamento ID:', agendamentoId);
  
    // Confirmar exclusão
    const confirmDelete = window.confirm('Tem certeza que deseja deletar o agendamento?');
    if (confirmDelete) {
      try {
        await DeleteAgendamento(agendamentoId);
        alert('Agendamento deletado com sucesso!');
        setSelectedSlotForDelete(null);
        setReloadAgendamentos((prev) => !prev); // Atualiza o estado para recarregar agendamentos
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        alert('Erro ao deletar agendamento.');
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

  const closeDetails = () => setIsDetailsOpen(false);

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
      console.log('Slots a serem deletados:', slotsToDelete);
      setSelectedSlotForDelete(slotsToDelete);
    } else {
      // Limpar seleção se clicar fora de um agendamento
      setSelectedSlotForDelete(null);
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

      {isDetailsOpen && (
        <AgendamentoDetails modalData={modalData} closeDetails={closeDetails} />
      )}

      <nav>
        <button onClick={handleOpenModal} disabled={currentRange.length === 0}>
          Agendar
        </button>

        {selectedSlotForDelete && (
          <button
            onClick={() =>
              handleDeleteProcedure(
                selectedSlotForDelete.day,
                selectedSlotForDelete.time,
              )
            }
          >
            Excluir
          </button>
        )}

        <button onClick={handlePreviousWeek}>← Semana Anterior</button>
        <button onClick={handleNextWeek}>Próxima Semana →</button>
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
                    className={`${isSelected(day.label, time) ? 'selected' : ''} 
                              ${currentRange.includes(time) && currentDay === day.label ? 'dragging' : ''} 
                              ${selectedSlotForDelete?.some(
                      (slot) => slot.day === day.label && slot.time === time
                    )
                        ? 'dragging'
                        : ''}`}
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
          setModalData={setModalData}
          handleSaveModal={handleSaveModal}
        />
      )}
    </div>
  );
};

export default Agendamento;
