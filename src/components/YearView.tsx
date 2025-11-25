import { CalendarEvent, MODULE_COLORS } from "@/data/calendarData";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface YearViewProps {
  currentYear: number;
  events: CalendarEvent[];
  onMonthClick: (month: number) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const getDaysInMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days: (number | null)[] = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  return days;
};

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start && !end) return false;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (start && end) {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return d >= s && d <= e;
  }
  if (start) {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    return d.getTime() === s.getTime();
  }
  return false;
};

const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
  return events.filter(event => isDateInRange(date, event.dataInicio, event.dataFim));
};

const getModuloForDate = (date: Date, events: CalendarEvent[]): string | null => {
  const dayEvents = getEventsForDate(date, events);
  if (dayEvents.length > 0) {
    return dayEvents[0].modulo;
  }
  return null;
};

export const YearView = ({ currentYear, events, onMonthClick }: YearViewProps) => {
  const today = new Date();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {MONTH_NAMES.map((monthName, monthIndex) => {
        const days = getDaysInMonth(currentYear, monthIndex);
        
        return (
          <div
            key={monthName}
            className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={() => onMonthClick(monthIndex)}
          >
            <div className="bg-primary/10 px-4 py-2 border-b border-border">
              <h3 className="font-semibold text-foreground">{monthName}</h3>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {WEEKDAYS.map((day, i) => (
                  <div
                    key={`${monthName}-${day}-${i}`}
                    className="text-[10px] text-center text-muted-foreground font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${monthIndex}-${index}`} className="w-6 h-6" />;
                  }
                  
                  const date = new Date(currentYear, monthIndex, day);
                  const dayEvents = getEventsForDate(date, events);
                  const hasEvents = dayEvents.length > 0;
                  const modulo = hasEvents ? dayEvents[0].modulo : null;
                  const colors = modulo ? MODULE_COLORS[modulo] : null;
                  const isToday = date.toDateString() === today.toDateString();
                  
                  return (
                    <Tooltip key={`${monthIndex}-${day}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-6 h-6 flex items-center justify-center text-[10px] rounded-full transition-all",
                            hasEvents && colors && `${colors.bg} text-white`,
                            !hasEvents && "text-foreground hover:bg-accent",
                            isToday && !hasEvents && "ring-2 ring-primary",
                            isToday && hasEvents && "ring-2 ring-white"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {day}
                        </div>
                      </TooltipTrigger>
                      {hasEvents && (
                        <TooltipContent side="right" className="max-w-[250px]">
                          <div className="space-y-1">
                            {dayEvents.slice(0, 5).map((event, i) => (
                              <div key={i} className="text-xs">
                                <span className="font-medium">{event.atividade}</span>
                                <span className="text-muted-foreground ml-1">({event.modulo})</span>
                              </div>
                            ))}
                            {dayEvents.length > 5 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayEvents.length - 5} mais eventos
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
