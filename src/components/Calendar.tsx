import { useState, useMemo, useEffect } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarFilters } from "./CalendarFilters";
import { MonthView } from "./MonthView";
import { YearView } from "./YearView";
import { EventModal } from "./EventModal";
import { ModuleLegend } from "./ModuleLegend";
import { CsvUploader } from "./CsvUploader";
import { calendarEvents as defaultEvents, CalendarEvent, MODULOS, CATEGORIAS } from "@/data/calendarData";

const loadEventsFromStorage = (): CalendarEvent[] | null => {
  const stored = localStorage.getItem('calendarEvents');
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((e: any) => ({
      ...e,
      dataInicio: e.dataInicio ? new Date(e.dataInicio) : null,
      dataFim: e.dataFim ? new Date(e.dataFim) : null
    }));
  } catch {
    return null;
  }
};

export const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    return loadEventsFromStorage() || defaultEvents;
  });
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  const [selectedModulos, setSelectedModulos] = useState<string[]>([...MODULOS]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([...CATEGORIAS]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique modules and categories from current events
  const availableModulos = useMemo(() => {
    const modulos = [...new Set(events.map(e => e.modulo))].sort();
    return modulos;
  }, [events]);

  const availableCategorias = useMemo(() => {
    const categorias = [...new Set(events.map(e => e.categoria))].sort();
    return categorias;
  }, [events]);

  // Update selected filters when events change
  useEffect(() => {
    setSelectedModulos(availableModulos);
    setSelectedCategorias(availableCategorias);
  }, [availableModulos, availableCategorias]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => 
      selectedModulos.includes(event.modulo) &&
      selectedCategorias.includes(event.categoria)
    );
  }, [events, selectedModulos, selectedCategorias]);

  const handleDataLoad = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
  };

  const handlePrevious = () => {
    if (viewMode === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthClick = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setViewMode('month');
  };

  const handleModuloToggle = (modulo: string) => {
    setSelectedModulos(prev => 
      prev.includes(modulo) 
        ? prev.filter(m => m !== modulo)
        : [...prev, modulo]
    );
  };

  const handleCategoriaToggle = (categoria: string) => {
    setSelectedCategorias(prev =>
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Calendário Acadêmico
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Graduação EAD - Cronograma de Atividades
          </p>
          <CsvUploader onDataLoad={handleDataLoad} currentEvents={events} />
        </header>

        <CalendarFilters
          selectedModulos={selectedModulos}
          selectedCategorias={selectedCategorias}
          availableModulos={availableModulos}
          availableCategorias={availableCategorias}
          onModuloToggle={handleModuloToggle}
          onCategoriaToggle={handleCategoriaToggle}
        />

        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          onViewModeChange={setViewMode}
        />

        <ModuleLegend />

        {viewMode === 'year' ? (
          <YearView
            currentYear={currentDate.getFullYear()}
            events={filteredEvents}
            onMonthClick={handleMonthClick}
          />
        ) : (
          <MonthView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        )}

        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
