import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent, MODULE_COLORS } from "@/data/calendarData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Tag, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  if (!event) return null;
  
  const colors = MODULE_COLORS[event.modulo];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl leading-relaxed pr-6">
            {event.atividade}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colors.light)}>
              <BookOpen className={cn("h-5 w-5", colors.text)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Módulo</p>
              <Badge className={cn(colors.bg, "text-white")}>{event.modulo}</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <Tag className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p className="font-medium">{event.categoria}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <Calendar className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Período</p>
              <p className="font-medium">
                {event.dataInicio && format(event.dataInicio, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                {event.dataFim && event.dataInicio?.getTime() !== event.dataFim?.getTime() && (
                  <>
                    <span className="text-muted-foreground mx-2">até</span>
                    {format(event.dataFim, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <BookOpen className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Produto</p>
              <p className="font-medium">{event.produto}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
