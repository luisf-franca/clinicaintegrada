import React, { useState, useEffect } from 'react';

const CalendarFilter = ({ onDateSelect, selectedDate }) => {
    const [date, setDate] = useState(new Date());

    // Navegação de Mês
    const changeMonth = (offset) => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + offset, 1);
        setDate(newDate);
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
    const firstDay = getFirstDayOfMonth(date.getFullYear(), date.getMonth());
    const days = [];

    // Preencher dias vazios antes do dia 1
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Preencher os dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
        const currentDateStr = new Date(date.getFullYear(), date.getMonth(), d).toDateString();
        const isSelected = selectedDate && new Date(selectedDate).toDateString() === currentDateStr;
        const isToday = new Date().toDateString() === currentDateStr;

        days.push(
            <div
                key={d}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => onDateSelect(new Date(date.getFullYear(), date.getMonth(), d))}
            >
                {d}
            </div>
        );
    }

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="calendar-widget">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <span>{monthNames[date.getMonth()]} {date.getFullYear()}</span>
                <button onClick={() => changeMonth(1)}>&gt;</button>
            </div>
            <div className="calendar-weekdays">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div className="calendar-grid">
                {days}
            </div>
            <div className="calendar-footer">
                <button className="btn-today" onClick={() => {
                    const today = new Date();
                    setDate(today);
                    onDateSelect(today);
                }}>Hoje</button>
                <button className="btn-clear" onClick={() => onDateSelect(null)}>Limpar Data</button>
            </div>
        </div>
    );
};

export default CalendarFilter;
