import { Badge } from "@/components/ui/badge";
import { MODULOS, CATEGORIAS, MODULE_COLORS } from "@/data/calendarData";
import { cn } from "@/lib/utils";

interface CalendarFiltersProps {
  selectedModulos: string[];
  selectedCategorias: string[];
  onModuloToggle: (modulo: string) => void;
  onCategoriaToggle: (categoria: string) => void;
}

export const CalendarFilters = ({
  selectedModulos,
  selectedCategorias,
  onModuloToggle,
  onCategoriaToggle
}: CalendarFiltersProps) => {
  return (
    <div className="mb-6 space-y-4 bg-card rounded-xl p-4 border border-border shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Módulos
        </h3>
        <div className="flex flex-wrap gap-2">
          {MODULOS.map((modulo) => {
            const isSelected = selectedModulos.includes(modulo);
            const colors = MODULE_COLORS[modulo];
            return (
              <button
                key={modulo}
                onClick={() => onModuloToggle(modulo)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "border-2 hover:scale-105",
                  isSelected 
                    ? `${colors.bg} text-white ${colors.border}` 
                    : `bg-background ${colors.border} ${colors.text} hover:${colors.light}`
                )}
              >
                {modulo}
              </button>
            );
          })}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Categorias
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((categoria) => {
            const isSelected = selectedCategorias.includes(categoria);
            return (
              <Badge
                key={categoria}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105 py-1.5 px-3",
                  isSelected && "bg-primary"
                )}
                onClick={() => onCategoriaToggle(categoria)}
              >
                {categoria}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};
