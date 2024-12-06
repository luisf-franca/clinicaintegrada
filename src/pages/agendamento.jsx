import React, { useState } from 'react';
import '../styles/agendamento.css';
import Especialidade from '../components/Especialidade/Especialidade';
import AgendamentoModal from '../components/AgendamentoModal/AgendamentoModal';
import AgendamentoDetails from '../components/AgendamentoDetails/AgendamentoDetails';

const Agendamento = () => {
  const [selectedSlots, setSelectedSlots] = useState({});
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
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        slots.push(formattedTime);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  const handleDeleteProcedure = (day, time) => {
    const procedureToDelete = selectedSlots[day]?.[time];

    if (procedureToDelete) {
      setSelectedSlots((prev) => {
        const updatedDay = { ...prev[day] };
        Object.keys(updatedDay).forEach((slotTime) => {
          if (updatedDay[slotTime] === procedureToDelete) {
            delete updatedDay[slotTime];
          }
        });

        return {
          ...prev,
          [day]: Object.keys(updatedDay).length > 0 ? updatedDay : undefined,
        };
      });
    }
    setSelectedSlotForDelete(null);
  };

  const isSelected = (day, time) => selectedSlots[day]?.[time];

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  // const handleShowDetails = (day, time) => {
  //   setModalData({
  //     patientName: selectedSlots[day]?.[time]?.patientName || '',
  //     interns: selectedSlots[day]?.[time]?.interns || '',
  //     procedure: selectedSlots[day]?.[time]?.procedure || '',
  //     observations: selectedSlots[day]?.[time]?.observations || '',
  //     startSlot: time,
  //     endSlot: selectedSlots[day]?.[time]?.endSlot || '',
  //   });
  //   setIsDetailsOpen(true);
  // };

  const closeDetails = () => setIsDetailsOpen(false);

  return (
    <div
      className="agendamento"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <hgroup>
        <h1>Agendamentos</h1>
        <Especialidade />
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
                    className={`${
                      isSelected(day.label, time) ? 'selected' : ''
                    } ${
                      currentRange.includes(time) && currentDay === day.label
                        ? 'dragging'
                        : ''
                    }`}
                    onMouseDown={() => handleMouseDown(day.label, time)}
                    onMouseEnter={() => handleMouseEnter(time)}
                    onClick={() => {
                      if (isSelected(day.label, time)) {
                        setSelectedSlotForDelete({
                          day: day.label,
                          time: time,
                        });
                      }
                    }}
                  >
                    {isSelected(day.label, time) ? (
                      <div className="procedure">
                        {selectedSlots[day.label][time]}
                      </div>
                    ) : (
                      ''
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
