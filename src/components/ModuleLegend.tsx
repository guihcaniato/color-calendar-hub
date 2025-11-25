import { MODULOS, MODULE_COLORS } from "@/data/calendarData";
import { cn } from "@/lib/utils";

export const ModuleLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6 py-4 flex-wrap">
      {MODULOS.map((modulo) => {
        const colors = MODULE_COLORS[modulo];
        return (
          <div key={modulo} className="flex items-center gap-2">
            <div className={cn("w-4 h-4 rounded-full", colors.bg)} />
            <span className="text-sm font-medium text-muted-foreground">
              Módulo {modulo}
            </span>
          </div>
        );
      })}
    </div>
  );
};
