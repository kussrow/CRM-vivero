import { useState, useEffect } from 'react';
import { mockStages, mockUsers } from '../data/mockData';
import { fetchProducts, fetchLeads, createLead } from '../lib/api';
import type { Product } from '../lib/api';
import { Search, Plus, Filter, ArrowUpDown, Eye, Edit2, Trash2, MoreVertical, Check, Loader2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import type { Lead } from '../types';
import { useAuthStore } from '../store/authStore';

const stageVariant = (stageId: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    s1: 'info', s2: 'default', s3: 'warning', s4: 'warning', s5: 'success', s6: 'danger',
  };
  return map[stageId] || 'default';
};

export default function Leads() {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const estimatedTotal = products
    .filter(p => selectedProductIds.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, lds] = await Promise.all([fetchProducts(), fetchLeads()]);
      setProducts(prods);
      setLeads(lds);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const newLeadData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      city: formData.get('city') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      source: formData.get('source') as string,
      condicion_pago: formData.get('condicion_pago') as string,
      cuit: formData.get('cuit') as string,
      tipo_factura: formData.get('tipo_factura') as string,
      razon_social: formData.get('razon_social') as string,
      direccion_facturacion: formData.get('direccion_facturacion') as string,
      notes: formData.get('notes') as string,
      estimated_amount: estimatedTotal,
      pipeline_stage_id: '22222222-2222-2222-2222-222222222221', // Nuevo contacto UUID
      assigned_user_id: user.id,
      status: 'active',
      product_interest: products
        .filter(p => selectedProductIds.includes(p.id))
        .map(p => p.name)
        .join(', '),
      selected_product_ids: selectedProductIds
    };

    setFormError(null);
    try {
      const created = await createLead(newLeadData);
      if (created) {
        setLeads([created, ...leads]);
        setShowCreateModal(false);
        setSelectedProductIds([]);
        alert('Lead creado con éxito');
      }
    } catch (error: any) {
      console.error("Error creating lead:", error);
      const msg = error.message || 'Error desconocido';
      setFormError(msg);
      alert('Error al crear el lead: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchSearch = lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lead_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStage = stageFilter ? lead.pipeline_stage_id === stageFilter : true;
    return matchSearch && matchStage;
  });

  const fmtCurrency = (n: number) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(n);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Leads</h2>
          <p className="text-sm text-muted-foreground mt-1">{filteredLeads.length} leads encontrados</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2.5 bg-background border border-input rounded-lg outline-none text-sm focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas las etapas</option>
              {mockStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3.5 font-medium">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Código <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5 font-medium">Cliente</th>
                <th className="px-6 py-3.5 font-medium">Interés</th>
                <th className="px-6 py-3.5 font-medium">Etapa</th>
                <th className="px-6 py-3.5 font-medium text-right">Monto Est.</th>
                <th className="px-6 py-3.5 font-medium">Vendedor</th>
                <th className="px-6 py-3.5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.map(lead => {
                const stage = mockStages.find(s => s.id === lead.pipeline_stage_id);
                const seller = mockUsers.find(u => u.id === lead.assigned_user_id);
                
                return (
                  <tr key={lead.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-semibold text-primary bg-primary/5 px-2 py-1 rounded">{lead.lead_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center ring-1 ring-blue-500/10 flex-shrink-0">
                          <span className="text-[10px] font-bold text-primary">{lead.first_name[0]}{lead.last_name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{lead.first_name} {lead.last_name}</p>
                          <p className="text-[11px] text-muted-foreground">{lead.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lead.product_interest}</td>
                    <td className="px-6 py-4">
                      <Badge variant={stageVariant(lead.pipeline_stage_id)} dot>
                        {stage?.name || 'Sin etapa'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                      {fmtCurrency(lead.estimated_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {seller?.full_name || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative flex justify-end">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                          className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {activeMenuId === lead.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)}></div>
                            <div className="absolute right-0 mt-8 w-40 bg-card border border-border rounded-lg shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in duration-150">
                              <button 
                                onClick={() => { setSelectedLead(lead as Lead); setShowDetailModal(true); setActiveMenuId(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" /> Ver detalle
                              </button>
                              <button 
                                onClick={() => { setSelectedLead(lead as Lead); setShowEditModal(true); setActiveMenuId(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                              >
                                <Edit2 className="h-4 w-4 text-muted-foreground" /> Editar
                              </button>
                              <div className="h-px bg-border my-1"></div>
                              <button 
                                onClick={() => { if(confirm('¿Seguro que deseas eliminar este lead?')) { setActiveMenuId(null); } }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" /> Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground text-sm">
                    No se encontraron leads con esos filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Lead Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo Lead" size="xl">
        <form className="space-y-8" onSubmit={handleCreateLead}>
          
          {formError && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
              {formError}
            </div>
          )}

          {/* SECCIÓN: DATOS PERSONALES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Datos Personales</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre *</label>
                <input name="first_name" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Juan" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Apellido</label>
                <input name="last_name" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Pérez" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Localidad *</label>
                <input name="city" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="CABA" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Teléfono *</label>
                <input name="phone" type="tel" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="1122334455" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                <input name="email" type="email" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="juan@email.com" />
              </div>
            </div>
          </div>

          {/* SECCIÓN: DATOS PARA FACTURACIÓN / INTERÉS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Facturación e Interés</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Interés Checklist */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">Interés (Productos)</label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-3 border border-input rounded-lg bg-muted/20">
                    {products.map(product => (
                      <label key={product.id} className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer h-4 w-4 appearance-none rounded border border-input bg-background checked:bg-primary checked:border-primary transition-all cursor-pointer"
                            checked={selectedProductIds.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedProductIds(prev => [...prev, product.id]);
                              else setSelectedProductIds(prev => prev.filter(id => id !== product.id));
                            }}
                          />
                          <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <div className="flex flex-1 justify-between items-center gap-2">
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{product.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{fmtCurrency(product.price)}</span>
                        </div>
                      </label>
                    ))}
                    {products.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No hay productos disponibles</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Origen</label>
                    <select name="source" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Web">Web</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Monto Est. *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <input 
                        type="number" 
                        value={estimatedTotal}
                        readOnly
                        className="w-full pl-7 pr-3 py-2.5 border border-primary/50 rounded-lg bg-primary/5 text-primary font-bold focus:ring-2 focus:ring-primary/30 outline-none text-sm" 
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 italic">Suma automática de productos</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nota</label>
                  <textarea name="notes" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={2} placeholder="Notas adicionales..." />
                </div>
              </div>

              <div className="space-y-4 bg-muted/10 p-4 rounded-xl border border-dashed border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Condición de Pago</label>
                    <select name="condicion_pago" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                      <option value="Contado">Contado</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Cuenta Corriente">Cuenta Corriente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">CUIT</label>
                    <input name="cuit" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="20-12345678-9" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Tipo Factura</label>
                    <select name="tipo_factura" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                      <option value="A">Factura A</option>
                      <option value="B">Factura B</option>
                      <option value="C">Factura C</option>
                      <option value="E">Factura E</option>
                      <option value="M">Factura M</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Razón Social</label>
                    <input name="razon_social" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Empresa S.A." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Dirección de Facturación</label>
                    <input name="direccion_facturacion" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Av. Siempre Viva 123" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear Lead'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Lead ${selectedLead?.lead_code || ''}`} size="lg">
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center ring-1 ring-blue-500/10">
                <span className="text-lg font-bold text-primary">{selectedLead.first_name[0]}{selectedLead.last_name[0]}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selectedLead.first_name} {selectedLead.last_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedLead.city} · {selectedLead.product_interest}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Monto Estimado" value={fmtCurrency(selectedLead.estimated_amount)} />
              <InfoItem label="Etapa" value={mockStages.find(s => s.id === selectedLead.pipeline_stage_id)?.name || '-'} />
              <InfoItem label="Vendedor" value={mockUsers.find(u => u.id === selectedLead.assigned_user_id)?.full_name || '-'} />
              <InfoItem label="Origen" value={selectedLead.source || 'No especificado'} />
              <InfoItem label="Estado" value={selectedLead.status === 'active' ? 'Activo' : 'Archivado'} />
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Lead Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Lead" size="lg">
        {selectedLead && (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre *</label>
                <input type="text" defaultValue={selectedLead.first_name} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Apellido</label>
                <input type="text" defaultValue={selectedLead.last_name} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Ciudad</label>
                <input type="text" defaultValue={selectedLead.city} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Interés *</label>
                <input type="text" defaultValue={selectedLead.product_interest} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Monto Estimado</label>
                <input type="number" defaultValue={selectedLead.estimated_amount} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Origen</label>
                <select defaultValue={selectedLead.source || 'Otro'} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Web">Web</option>
                  <option value="Correo">Correo</option>
                  <option value="Recomendación">Recomendación</option>
                  <option value="Otro">Otro</option>
                </select>
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

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-muted/30 rounded-lg">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
