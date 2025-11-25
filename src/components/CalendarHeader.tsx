import { ChevronLeft, ChevronRight, Calendar, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: 'year' | 'month';
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: 'year' | 'month') => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CalendarHeader = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange
}: CalendarHeaderProps) => {
  const displayText = viewMode === 'year' 
    ? currentDate.getFullYear().toString()
    : `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground min-w-[200px] text-center">
          {displayText}
        </h2>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onToday} className="ml-2">
          Hoje
        </Button>
      </div>
      
      <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
        <Button
          variant={viewMode === 'year' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('year')}
          className="gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          Ano
        </Button>
        <Button
          variant={viewMode === 'month' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('month')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Mês
        </Button>
      </div>
    </div>
  );
};
