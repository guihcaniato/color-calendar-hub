import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, X } from "lucide-react";
import { CalendarEvent } from "@/data/calendarData";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface CsvUploaderProps {
  onDataLoad: (events: CalendarEvent[]) => void;
  currentEvents: CalendarEvent[];
}

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.trim() === '') return null;
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return isNaN(date.getTime()) ? null : date;
};

const formatDate = (date: Date | null): string => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const CsvUploader = ({ onDataLoad, currentEvents }: CsvUploaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsv = (content: string): CalendarEvent[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const events: CalendarEvent[] = [];
    
    // Skip header (first line)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Handle both semicolon and comma separators
      const separator = line.includes(';') ? ';' : ',';
      const parts = line.split(separator).map(p => p.trim().replace(/^"|"$/g, ''));
      
      if (parts.length >= 6) {
        const dataInicio = parseDate(parts[4]);
        const dataFim = parseDate(parts[5]);
        
        if (dataInicio || dataFim) {
          events.push({
            id: `event-${i}`,
            atividade: parts[0],
            produto: parts[1],
            categoria: parts[2],
            modulo: parts[3],
            dataInicio,
            dataFim
          });
        }
      }
    }
    
    return events;
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const events = parseCsv(content);
        
        if (events.length === 0) {
          toast({
            title: "Arquivo vazio",
            description: "Nenhum evento válido encontrado no arquivo.",
            variant: "destructive"
          });
          return;
        }

        // Save to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events.map(e => ({
          ...e,
          dataInicio: e.dataInicio?.toISOString(),
          dataFim: e.dataFim?.toISOString()
        }))));
        
        onDataLoad(events);
        setIsOpen(false);
        
        toast({
          title: "Dados importados!",
          description: `${events.length} eventos carregados com sucesso.`,
        });
      } catch (error) {
        toast({
          title: "Erro ao processar",
          description: "Verifique se o arquivo está no formato correto.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const downloadTemplate = () => {
    const header = "Atividade;Produto;Categoria;Módulo;Data Início;Data Fim\n";
    const rows = currentEvents.map(e => 
      `${e.atividade};${e.produto};${e.categoria};${e.modulo};${formatDate(e.dataInicio)};${formatDate(e.dataFim)}`
    ).join('\n');
    
    const content = header + rows;
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendario_academico.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "O arquivo CSV foi baixado.",
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem('calendarEvents');
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Gerenciar Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Dados do Calendário</DialogTitle>
          <DialogDescription>
            Importe um arquivo CSV ou baixe o modelo atual para edição.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste um arquivo CSV aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Formato: Atividade;Produto;Categoria;Módulo;Data Início;Data Fim
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTemplate} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Baixar Modelo
            </Button>
            <Button variant="outline" onClick={resetToDefault} className="flex-1 gap-2">
              <X className="h-4 w-4" />
              Restaurar Original
            </Button>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Instruções:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Baixe o modelo atual clicando em "Baixar Modelo"</li>
              <li>Edite o arquivo no Excel ou Google Sheets</li>
              <li>Mantenha o formato de data: DD/MM/AAAA</li>
              <li>Salve como CSV e faça upload aqui</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
