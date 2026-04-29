import { useState } from 'react';
import { mockLeads, mockStages, mockUsers } from '../data/mockData';
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Badge from '../components/ui/Badge';

const stageColors: Record<string, string> = {
  s1: 'from-blue-500 to-blue-600',
  s2: 'from-cyan-500 to-teal-600',
  s3: 'from-amber-500 to-orange-500',
  s4: 'from-violet-500 to-purple-600',
  s5: 'from-emerald-500 to-green-600',
  s6: 'from-red-500 to-rose-600',
};

function Column({ stage, leads }: { stage: any, leads: any[] }) {
  const totalAmount = leads.reduce((acc: number, l: any) => acc + l.estimated_amount, 0);
  const fmtCurrency = (n: number) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(n);
  
  return (
    <div className="flex flex-col bg-muted/20 rounded-xl w-80 flex-shrink-0 border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${stageColors[stage.id] || 'from-gray-400 to-gray-500'}`} />
            <h3 className="font-semibold text-sm text-foreground">{stage.name}</h3>
          </div>
          <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
            {leads.length}
          </span>
        </div>
        <div className="text-xs font-semibold text-primary">
          {fmtCurrency(totalAmount)}
        </div>
      </div>
      
      <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5 min-h-[150px]">
        <SortableContext items={leads.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead: any) => (
            <SortableCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

function SortableCard({ lead }: { lead: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  
  const seller = mockUsers.find((u: any) => u.id === lead.assigned_user_id);
  const fmtCurrency = (n: number) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(n);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card p-3.5 rounded-lg border border-border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono font-semibold text-primary bg-primary/5 px-1.5 py-0.5 rounded">{lead.lead_code}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
          {seller?.full_name.split(' ')[0] || 'N/A'}
        </span>
      </div>
      <h4 className="font-medium text-sm text-foreground mb-0.5">{lead.first_name} {lead.last_name}</h4>
      <p className="text-[11px] text-muted-foreground mb-3">{lead.product_interest}</p>
      
      <div className="flex justify-between items-center pt-2.5 border-t border-border">
        <span className="text-[11px] text-muted-foreground">{lead.city}</span>
        <span className="text-xs font-bold text-foreground">
          {fmtCurrency(lead.estimated_amount)}
        </span>
      </div>
    </div>
  );
}

export default function Kanban() {
  const [leads, setLeads] = useState(mockLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeLead = leads.find(l => l.id === active.id);
    const overLead = leads.find(l => l.id === over.id);
    
    if (activeLead && overLead && activeLead.pipeline_stage_id !== overLead.pipeline_stage_id) {
      setLeads(leads.map(l => {
        if (l.id === activeLead.id) {
          return { ...l, pipeline_stage_id: overLead.pipeline_stage_id };
        }
        return l;
      }));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pipeline Comercial</h2>
          <p className="text-sm text-muted-foreground mt-1">Arrastrá los leads entre las etapas</p>
        </div>
        <Badge variant="info" dot>{leads.length} leads activos</Badge>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full items-start">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {mockStages.sort((a: any, b: any) => a.position - b.position).map((stage: any) => {
              const columnLeads = leads.filter(l => l.pipeline_stage_id === stage.id);
              return (
                <Column key={stage.id} stage={stage} leads={columnLeads} />
              );
            })}
            
            <DragOverlay>
              {activeId ? (
                <SortableCard lead={leads.find(l => l.id === activeId)} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
