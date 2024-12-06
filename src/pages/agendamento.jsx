import React, { useState } from 'react';
import '../styles/agendamento.css';
import Especialidade from '../components/Especialidade/Especialidade';
import AgendamentoModal from '../components/AgendamentoModal/AgendamentoModal';

const Agendamento = () => {
  const [selectedSlots, setSelectedSlots] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [startSlot, setStartSlot] = useState(null);
  const [currentRange, setCurrentRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    patientName: '',
    interns: '',
    procedure: '',
    observations: '',
  });
  const [currentWeek, setCurrentWeek] = useState(0);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
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

  const generateMonthDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days = [];

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        label: date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
      });
    }

    return days;
  };

  const monthDays = generateMonthDays();

  const getDaysForWeek = () => {
    const start = currentWeek * 7;
    const end = start + 7;
    return monthDays.slice(start, end);
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
  };

  const isSelected = (day, time) => selectedSlots[day]?.[time];

  const handlePreviousWeek = () => {
    if (currentWeek > 0) setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    if ((currentWeek + 1) * 7 < monthDays.length)
      setCurrentWeek(currentWeek + 1);
  };

  return (
    <div
      className="agendamento-card"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <hgroup>
        <h1>Agendamentos</h1>
        <Especialidade />
        <button onClick={handleOpenModal} disabled={currentRange.length === 0}>
          Agendar
        </button>
      </hgroup>

      <div className="week-navigation">
        <button onClick={handlePreviousWeek} disabled={currentWeek === 0}>
          ← Semana Anterior
        </button>
        <button
          onClick={handleNextWeek}
          disabled={(currentWeek + 1) * 7 >= monthDays.length}
        >
          Próxima Semana →
        </button>
      </div>

      <div className="table-wrapper">
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
                    className={`slot ${
                      isSelected(day.label, time) ? 'selected' : ''
                    } ${
                      currentRange.includes(time) && currentDay === day.label
                        ? 'dragging'
                        : ''
                    }`}
                    onMouseDown={() => handleMouseDown(day.label, time)}
                    onMouseEnter={() => handleMouseEnter(time)}
                  >
                    {isSelected(day.label, time) ? (
                      <div className="procedure">
                        {selectedSlots[day.label][time]}
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProcedure(day.label, time);
                          }}
                        >
                          Excluir
                        </button>
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
          currentRange={currentRange}
        />
      )}
    </div>
  );
};

export default Agendamento;
