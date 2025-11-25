import { useState, useMemo } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarFilters } from "./CalendarFilters";
import { MonthView } from "./MonthView";
import { YearView } from "./YearView";
import { EventModal } from "./EventModal";
import { ModuleLegend } from "./ModuleLegend";
import { calendarEvents, CalendarEvent, MODULOS, CATEGORIAS } from "@/data/calendarData";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  const [selectedModulos, setSelectedModulos] = useState<string[]>([...MODULOS]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([...CATEGORIAS]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(event => 
      selectedModulos.includes(event.modulo) &&
      selectedCategorias.includes(event.categoria)
    );
  }, [selectedModulos, selectedCategorias]);

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
          <p className="text-muted-foreground text-lg">
            Graduação EAD - Cronograma de Atividades
          </p>
        </header>

        <CalendarFilters
          selectedModulos={selectedModulos}
          selectedCategorias={selectedCategorias}
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
