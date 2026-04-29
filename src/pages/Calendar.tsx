import { useState } from 'react';
import { mockEvents, mockLeads, mockUsers } from '../data/mockData';
import { isPast, parseISO, isToday, isTomorrow, isAfter, addDays } from 'date-fns';
import { Clock, CheckCircle2, Calendar as CalendarIcon, MapPin, User as UserIcon, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const TIME_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7; // 07:00 to 21:30
  const minute = i % 2 === 0 ? '00' : '30';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour;
  const h12Pad = hour12.toString().padStart(2, '0');
  const h24Pad = hour.toString().padStart(2, '0');
  return { value: `${h24Pad}:${minute}`, label: `${h12Pad}:${minute} ${ampm}` };
});

export default function Calendar() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState(mockEvents);

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const expiredEvents = events.filter(e => isPast(parseISO(e.due_at)) && e.status !== 'completed' && !isToday(parseISO(e.due_at)));
  const todayEvents = events.filter(e => isToday(parseISO(e.due_at)));
  const tomorrowEvents = events.filter(e => isTomorrow(parseISO(e.due_at)));
  const upcomingEvents = events.filter(e => isAfter(parseISO(e.due_at), addDays(new Date(), 1)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calendario Comercial</h2>
          <p className="text-sm text-muted-foreground mt-1">{events.length} eventos programados</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <EventColumn title="Vencidos" events={expiredEvents} variant="danger" onEdit={handleEdit} onDelete={handleDelete} />
        <EventColumn title="Hoy" events={todayEvents} variant="info" onEdit={handleEdit} onDelete={handleDelete} />
        <EventColumn title="Mañana" events={tomorrowEvents} variant="default" onEdit={handleEdit} onDelete={handleDelete} />
        <EventColumn title="Próximos" events={upcomingEvents} variant="outline" onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo Evento" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Título *</label>
              <input type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Llamar a Juan" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Tipo *</label>
              <select className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required>
                <option value="call">Llamada</option>
                <option value="meeting">Reunión</option>
                <option value="technical_visit">Visita Técnica</option>
                <option value="budget_send">Enviar Presupuesto</option>
                <option value="follow_up">Seguimiento</option>
                <option value="closing">Cierre</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Fecha *</label>
              <input type="date" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Hora *</label>
              <select className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required>
                <option value="">Seleccionar...</option>
                {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Vendedor</label>
              <select className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                {mockUsers.filter(u => u.role === 'seller').map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Lead relacionado</label>
              <select className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                <option value="">Ninguno</option>
                {mockLeads.map(l => <option key={l.id} value={l.id}>{l.lead_code} - {l.first_name} {l.last_name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Descripción</label>
            <textarea className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={3} placeholder="Detalles del evento..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all">
              Crear Evento
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Evento" size="lg">
        {selectedEvent && (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Título *</label>
                <input type="text" defaultValue={selectedEvent.title} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Tipo *</label>
                <select defaultValue={selectedEvent.event_type} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required>
                  <option value="call">Llamada</option>
                  <option value="meeting">Reunión</option>
                  <option value="technical_visit">Visita Técnica</option>
                  <option value="budget_send">Enviar Presupuesto</option>
                  <option value="follow_up">Seguimiento</option>
                  <option value="closing">Cierre</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Fecha *</label>
                <input type="date" defaultValue={selectedEvent.due_at ? new Date(selectedEvent.due_at).toISOString().split('T')[0] : ''} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Hora *</label>
                <select defaultValue={selectedEvent.due_at ? new Date(selectedEvent.due_at).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}) : ''} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required>
                  <option value="">Seleccionar...</option>
                  {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Vendedor</label>
                <select defaultValue={selectedEvent.assigned_user_id} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                  {mockUsers.filter(u => u.role === 'seller').map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Estado *</label>
                <select defaultValue={selectedEvent.status} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Descripción</label>
              <textarea defaultValue={selectedEvent.description} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
                Cancelar
              </button>
              <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all">
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function EventColumn({ title, events, variant, onEdit, onDelete }: { title: string, events: any[], variant: 'danger' | 'info' | 'default' | 'outline', onEdit: (e: any) => void, onDelete: (id: string) => void }) {
  const headerColors: Record<string, string> = {
    danger: 'bg-red-500/10 border-red-500/20 text-red-500',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
    default: 'bg-muted/50 border-border text-foreground',
    outline: 'bg-muted/30 border-border text-muted-foreground',
  };

  return (
    <div className="flex flex-col bg-card rounded-xl overflow-hidden border border-border shadow-sm h-[calc(100vh-220px)]">
      <div className={`p-4 border-b flex justify-between items-center ${headerColors[variant]}`}>
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="bg-background/80 text-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
          {events.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {events.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground mt-8">Sin eventos</p>
        ) : (
          events.map(event => <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
}

function EventCard({ event, onEdit, onDelete }: { event: any, onEdit: (e: any) => void, onDelete: (id: string) => void }) {
  const lead = mockLeads.find(l => l.id === event.lead_id);
  const seller = mockUsers.find(u => u.id === event.assigned_user_id);
  const isCompleted = event.status === 'completed';
  const isExpired = isPast(parseISO(event.due_at)) && !isToday(parseISO(event.due_at)) && !isCompleted;

  const typeLabels: Record<string, string> = {
    call: 'Llamada', meeting: 'Reunión', technical_visit: 'Visita Técnica',
    budget_send: 'Enviar Presupuesto', follow_up: 'Seguimiento', closing: 'Cierre', other: 'Otro'
  };

  return (
    <div className={`group relative p-3.5 rounded-lg border transition-all ${
      isCompleted ? 'bg-muted/20 border-border opacity-60' : 
      isExpired ? 'bg-red-500/5 border-red-500/15' : 
      'bg-background border-border shadow-sm hover:shadow-md hover:border-primary/20'
    }`}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm z-10">
        <button onClick={() => onEdit(event)} className="p-1 text-muted-foreground hover:text-amber-500 rounded-md hover:bg-accent transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
        <button onClick={() => onDelete(event.id)} className="p-1 text-muted-foreground hover:text-red-500 rounded-md hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>

      <div className="flex justify-between items-start mb-2 pr-12">
        <Badge variant={isCompleted ? 'outline' : isExpired ? 'danger' : 'default'}>
          {typeLabels[event.event_type] || event.event_type}
        </Badge>
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Clock className={`h-4 w-4 ${isExpired ? 'text-red-500' : 'text-muted-foreground'}`} />
        )}
      </div>
      <h4 className={`font-medium text-sm mb-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {event.title}
      </h4>
      
      {lead && (
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center text-[11px] text-muted-foreground">
            <UserIcon className="h-3 w-3 mr-1.5" />
            {lead.first_name} {lead.last_name}
          </div>
          <div className="flex items-center text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1.5" />
            {lead.city}
          </div>
        </div>
      )}
      
      <div className="mt-3 pt-2.5 border-t border-border flex justify-between items-center text-[11px]">
        <span className="font-semibold text-foreground">
          {new Date(event.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-muted-foreground">{seller?.full_name.split(' ')[0]}</span>
      </div>
    </div>
  );
}
