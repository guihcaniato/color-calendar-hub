import { CalendarEvent, MODULE_COLORS } from "@/data/calendarData";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days: (Date | null)[] = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
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

export const MonthView = ({ currentDate, events, onEventClick }: MonthViewProps) => {
  const days = getDaysInMonth(currentDate);
  const today = new Date();
  
  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-muted">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="min-h-[120px] bg-muted/30 border-t border-r border-border" />;
          }
          
          const dayEvents = getEventsForDate(day, events);
          const isToday = day.toDateString() === today.toDateString();
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] border-t border-r border-border p-2 transition-colors hover:bg-accent/50",
                isToday && "bg-primary/5"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full",
                isToday && "bg-primary text-primary-foreground"
              )}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1 max-h-[80px] overflow-y-auto">
                {dayEvents.slice(0, 3).map((event) => {
                  const colors = MODULE_COLORS[event.modulo];
                  return (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onEventClick(event)}
                          className={cn(
                            "w-full text-left text-xs p-1 rounded truncate transition-all hover:scale-[1.02]",
                            colors.bg,
                            "text-white"
                          )}
                        >
                          {event.atividade}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[300px]">
                        <p className="font-semibold">{event.atividade}</p>
                        <p className="text-xs text-muted-foreground">{event.categoria}</p>
                        <p className="text-xs mt-1">
                          {event.dataInicio && format(event.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                          {event.dataFim && event.dataInicio?.getTime() !== event.dataFim?.getTime() && 
                            ` - ${format(event.dataFim, "dd/MM/yyyy", { locale: ptBR })}`
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
