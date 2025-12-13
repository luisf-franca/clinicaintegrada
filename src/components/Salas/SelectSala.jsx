import React, { useState, useEffect, useRef, useCallback } from 'react';
import GetSalas from '../../functions/Salas/GetSalas';
import './SelectSala.css';

const SelectSala = ({ onSelectSala, onSelectSalaObj, selectedSala, initialSala }) => {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSalas = useCallback(async (pageNum) => {
    // If we're already loading or verified we don't have more, stop.
    // However, for page 1 we always want to try.
    if (loading) return;

    setLoading(true);
    try {
      // pageSize 5 as requested
      const data = await GetSalas({
        page: pageNum,
        pageSize: 5,
        // No filter by specialty as requested: "buscar todas as salas (sem filtro de especialidade)"
      });

      const newItems = data.items || [];

      setSalas((prev) => {
        if (pageNum === 1) return newItems;
        // Filter out duplicates just in case
        const existingIds = new Set(prev.map(s => s.id));
        const uniqueNewItems = newItems.filter(s => !existingIds.has(s.id));
        return [...prev, ...uniqueNewItems];
      });

      // If we received fewer items than requested, or if we have all items, stop
      if (newItems.length < 5) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSalas(1);
  }, [fetchSalas]);

  // Handle scroll for infinite loading
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Check if we are near the bottom (less than 10px remaining)
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSalas(nextPage);
    }
  };

  const handleSelect = (sala) => {
    if (sala) {
      onSelectSala(sala.id);
      if (onSelectSalaObj) onSelectSalaObj(sala);
    } else {
      onSelectSala(null);
      if (onSelectSalaObj) onSelectSalaObj(null);
    }
    setIsOpen(false);
  };

  // Find selected sala name for display
  // Use loose equality (==) to handle potential string/number mismatches
  // Fallback to initialSala if provided and IDs match
  let selectedSalaObj = salas.find(s => s.id == selectedSala);

  if (!selectedSalaObj && initialSala && initialSala.id == selectedSala) {
    selectedSalaObj = initialSala;
  }

  const displayLabel = selectedSalaObj ? selectedSalaObj.nome : "Todas as salas...";

  return (
    <div className="select-sala-container" ref={dropdownRef}>
      <div
        className={`select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <span className="arrow">▼</span>
      </div>

      {isOpen && (
        <div className="select-options" onScroll={handleScroll} ref={listRef}>
          <div
            className={"select-option"}
            onClick={() => handleSelect(null)}
          >
            Todas as salas...
          </div>

          {salas.map((sala) => (
            <div
              key={sala.id}
              className={`select-option ${parseInt(selectedSala) === sala.id ? 'selected' : ''}`}
              onClick={() => handleSelect(sala)}
            >
              {sala.nome}
            </div>
          ))}

          {loading && <div className="loading-option">Carregando...</div>}

          {!loading && salas.length === 0 && (
            <div className="no-options">Nenhuma sala encontrada</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectSala;