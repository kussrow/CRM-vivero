import { useState } from 'react';
import { mockContacts, mockLeads, mockBudgets, mockEvents } from '../data/mockData';
import { Search, Plus, Mail, Phone, MapPin, User as UserIcon, Calendar, FileText, TrendingUp, Clock, History } from 'lucide-react';
import Modal from '../components/ui/Modal';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const filteredContacts = mockContacts.filter(c => 
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-500',
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Directorio de Contactos</h2>
          <p className="text-sm text-muted-foreground mt-1">{filteredContacts.length} contactos</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Contacto
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar contacto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-lg focus:ring-2 focus:ring-primary/30 outline-none shadow-sm text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredContacts.map((contact, i) => (
          <div key={contact.id} className="bg-card p-5 rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-bold text-sm text-white shadow-md`}>
                {contact.first_name[0]}{contact.last_name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{contact.first_name} {contact.last_name}</h3>
                <p className="text-[11px] text-muted-foreground">Cliente</p>
              </div>
            </div>
            
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate text-xs">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate text-xs">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate text-xs">{contact.city}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <button 
                onClick={() => { setSelectedContact(contact); setShowDetailModal(true); }}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Ver detalle
              </button>
              <button 
                onClick={() => { setSelectedContact(contact); setShowEditModal(true); }}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Contact Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo Contacto" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre *</label>
              <input type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Nombre" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Apellido *</label>
              <input type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Apellido" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Teléfono *</label>
              <input type="tel" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="1122334455" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email *</label>
              <input type="email" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="contacto@email.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Ciudad</label>
              <input type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Ciudad" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Dirección</label>
              <input type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Dirección" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Notas</label>
            <textarea className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={3} placeholder="Notas adicionales..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all">
              Crear Contacto
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Contact Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Perfil del Contacto" size="lg">
        {selectedContact && (() => {
          const contactLeads = mockLeads.filter(l => l.contact_id === selectedContact.id);
          const contactBudgets = mockBudgets.filter(b => contactLeads.some(l => l.id === b.lead_id));
          const contactEvents = mockEvents.filter(e => contactLeads.some(l => l.id === e.lead_id));
          const totalSpent = contactBudgets.filter(b => b.status === 'accepted').reduce((acc, b) => acc + b.total_amount, 0);

          return (
            <div className="space-y-6">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-primary/5 to-indigo-500/5 rounded-2xl border border-primary/10">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-xl ring-4 ring-white dark:ring-slate-900">
                  {selectedContact.first_name[0]}{selectedContact.last_name[0]}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-bold text-2xl text-foreground">{selectedContact.first_name} {selectedContact.last_name}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border">
                      <MapPin className="h-3.5 w-3.5" /> {selectedContact.city}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border">
                      <UserIcon className="h-3.5 w-3.5" /> Cliente Activo
                    </span>
                  </div>
                </div>
                <div className="sm:ml-auto text-center sm:text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Invertido</p>
                  <p className="text-2xl font-black text-primary">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalSpent)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Contact Info & Stats */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5" /> Información
                    </h4>
                    <div className="space-y-3">
                      <InfoBox icon={<Phone className="h-4 w-4" />} label="Teléfono" value={selectedContact.phone} />
                      <InfoBox icon={<Mail className="h-4 w-4" />} label="Email" value={selectedContact.email} />
                      <InfoBox icon={<MapPin className="h-4 w-4" />} label="Dirección" value={selectedContact.address || 'No especificada'} />
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> Resumen
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-muted/20 rounded-lg text-center">
                        <p className="text-lg font-bold text-foreground">{contactLeads.length}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Leads</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg text-center">
                        <p className="text-lg font-bold text-foreground">{contactBudgets.length}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Presup.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: History & Activities */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <History className="h-3.5 w-3.5" /> Actividad Reciente
                      </h4>
                    </div>
                    <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
                      {contactEvents.length > 0 ? contactEvents.sort((a, b) => new Date(b.due_at).getTime() - new Date(a.due_at).getTime()).map(event => (
                        <div key={event.id} className="p-4 flex gap-3 hover:bg-muted/10 transition-colors">
                          <div className={`p-2 rounded-lg h-fit ${
                            event.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                            event.status === 'expired' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.due_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <div className="mt-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                event.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                event.status === 'expired' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              }`}>
                                {event.status === 'completed' ? 'Completado' : event.status === 'expired' ? 'Vencido' : 'Pendiente'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                          No hay actividades registradas para este contacto.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Leads / Budgets List */}
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" /> Presupuestos Vigentes
                    </h4>
                    <div className="space-y-2">
                      {contactBudgets.map(budget => (
                        <div key={budget.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/5">
                          <div>
                            <p className="text-xs font-bold text-foreground">{budget.budget_code}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(budget.issue_date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-foreground">
                              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(budget.total_amount)}
                            </p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                              budget.status === 'accepted' ? 'text-emerald-500 bg-emerald-500/10' : 
                              budget.status === 'sent' ? 'text-blue-500 bg-blue-500/10' : 'text-muted-foreground bg-muted'
                            }`}>
                              {budget.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {contactBudgets.length === 0 && <p className="text-xs text-center text-muted-foreground py-2 italic">Sin presupuestos generados.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Edit Contact Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Contacto" size="lg">
        {selectedContact && (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre *</label>
                <input type="text" defaultValue={selectedContact.first_name} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Apellido *</label>
                <input type="text" defaultValue={selectedContact.last_name} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Teléfono *</label>
                <input type="tel" defaultValue={selectedContact.phone} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email *</label>
                <input type="email" defaultValue={selectedContact.email} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Ciudad</label>
                <input type="text" defaultValue={selectedContact.city} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Dirección</label>
                <input type="text" defaultValue={selectedContact.address} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" />
              </div>
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
function InfoBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{label}</p>
        <p className="text-sm text-foreground break-all">{value}</p>
      </div>
    </div>
  );
}
