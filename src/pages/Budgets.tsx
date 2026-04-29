import { useState, useEffect } from 'react';
import { mockBudgets } from '../data/mockData';
import { fetchProducts } from '../lib/api';
import type { Product } from '../lib/api';
import { Search, FileText, Send, Plus, Eye, Edit2, Trash2, MessageCircle, Mail } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { generateBudgetPDF } from '../lib/pdfUtils';

const statusConfig: Record<string, { label: string, variant: 'success' | 'info' | 'warning' | 'danger' | 'outline' }> = {
  accepted: { label: 'Aceptado', variant: 'success' },
  sent: { label: 'Enviado', variant: 'info' },
  draft: { label: 'Borrador', variant: 'outline' },
  rejected: { label: 'Rechazado', variant: 'danger' },
  expired: { label: 'Vencido', variant: 'warning' },
};

export default function Budgets() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const [createItems, setCreateItems] = useState<any[]>([]);
  const [editItems, setEditItems] = useState<any[]>([]);

  const handleOpenCreate = () => {
    setCreateItems([]);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (budget: any) => {
    setSelectedBudget(budget);
    // Dummy items for demonstration since mockBudgets don't have items
    setEditItems([{ id: Date.now().toString(), product_id: '', quantity: 1, unit_price: budget.total_amount }]);
    setShowEditModal(true);
  };

  const updateItemsList = (items: any[], setItems: any, id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'product_id') {
          const prod = products.find(p => p.id === value);
          if (prod) updated.unit_price = prod.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const addItemsRow = (items: any[], setItems: any) => {
    setItems([...items, { id: Date.now().toString(), product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItemsRow = (items: any[], setItems: any, id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const createTotal = createItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const editTotal = editItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

  const handleAction = (action: string, budget?: any) => {
    const targetBudget = budget || selectedBudget;
    
    if (action === 'Ver PDF' || action === 'Descargar') {
      if (targetBudget) {
        const dummyItems = [{
          product_name: 'Productos/Servicios de Piscina',
          quantity: 1,
          unit_price: targetBudget.total_amount
        }];
        generateBudgetPDF(targetBudget, dummyItems);
      }
      return;
    }

    if (action === 'WhatsApp' && targetBudget) {
      const message = `Hola ${targetBudget.customer_name}, te adjunto el presupuesto ${targetBudget.budget_code} por un total de ${fmtCurrency(targetBudget.total_amount)}.`;
      // En un caso real, buscaríamos el teléfono del lead/contacto
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    if (action === 'Email' && targetBudget) {
      const subject = `Presupuesto ${targetBudget.budget_code} - Vivero CRM`;
      const body = `Hola ${targetBudget.customer_name},\n\nAdjuntamos el presupuesto solicitado.\n\nSaludos.`;
      const mailtoUrl = `mailto:${targetBudget.customer_email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      return;
    }

    alert(`Funcionalidad "${action}" en desarrollo.`);
  };

  const filteredBudgets = mockBudgets.filter(b => 
    b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.budget_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmtCurrency = (n: number) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(n);

  const totalAccepted = mockBudgets.filter(b => b.status === 'accepted').reduce((a, b) => a + b.total_amount, 0);
  const totalPending = mockBudgets.filter(b => b.status === 'sent').reduce((a, b) => a + b.total_amount, 0);
  const totalRejected = mockBudgets.filter(b => b.status === 'rejected').reduce((a, b) => a + b.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Presupuestos</h2>
          <p className="text-sm text-muted-foreground mt-1">{mockBudgets.length} presupuestos</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total Aceptado</p>
          <p className="text-xl font-bold text-emerald-500 mt-1">{fmtCurrency(totalAccepted)}</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total Rechazado</p>
          <p className="text-xl font-bold text-red-500 mt-1">{fmtCurrency(totalRejected)}</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Pendiente de Respuesta</p>
          <p className="text-xl font-bold text-blue-500 mt-1">{fmtCurrency(totalPending)}</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Tasa de Aceptación</p>
          <p className="text-xl font-bold text-foreground mt-1">
            {Math.round((mockBudgets.filter(b => b.status === 'accepted').length / mockBudgets.length) * 100)}%
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por cliente o Nº de presupuesto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 outline-none text-sm transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3.5 font-medium">Nº Presupuesto</th>
                <th className="px-6 py-3.5 font-medium">Cliente</th>
                <th className="px-6 py-3.5 font-medium">Fecha</th>
                <th className="px-6 py-3.5 font-medium text-right">Total</th>
                <th className="px-6 py-3.5 font-medium">Estado</th>
                <th className="px-6 py-3.5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBudgets.map(budget => {
                const config = statusConfig[budget.status] || statusConfig.draft;
                return (
                  <tr key={budget.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-semibold text-primary bg-primary/5 px-2 py-1 rounded">{budget.budget_code}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{budget.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(budget.issue_date).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                      {fmtCurrency(budget.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={config.variant} dot>{config.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedBudget(budget); setShowDetailModal(true); }}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition-colors" title="Ver">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('Ver PDF', budget)}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition-colors" title="PDF">
                          <FileText className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('WhatsApp', budget)}
                          className="p-1.5 text-muted-foreground hover:text-emerald-500 rounded-md hover:bg-accent transition-colors" title="WhatsApp">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('Email', budget)}
                          className="p-1.5 text-muted-foreground hover:text-blue-500 rounded-md hover:bg-accent transition-colors" title="Enviar Email">
                          <Mail className="h-4 w-4" />
                        </button>
                        {budget.status === 'draft' && (
                          <button 
                            onClick={() => handleAction('Enviar a Cliente', budget)}
                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition-colors" title="Enviar">
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleOpenEdit(budget)}
                          className="p-1.5 text-muted-foreground hover:text-amber-500 rounded-md hover:bg-accent transition-colors" title="Editar">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('Eliminar Presupuesto', budget)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md hover:bg-destructive/10 transition-colors" title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Budget Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Presupuesto ${selectedBudget?.budget_code || ''}`} size="md">
        {selectedBudget && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">{selectedBudget.customer_name}</h3>
                <p className="text-sm text-muted-foreground">Fecha: {new Date(selectedBudget.issue_date).toLocaleDateString('es-AR')}</p>
              </div>
              <Badge variant={statusConfig[selectedBudget.status]?.variant || 'outline'}>
                {statusConfig[selectedBudget.status]?.label || selectedBudget.status}
              </Badge>
            </div>
            
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium">{fmtCurrency(selectedBudget.total_amount * 0.79)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Impuestos (IVA 21%)</span>
                <span className="text-sm font-medium">{fmtCurrency(selectedBudget.total_amount * 0.21)}</span>
              </div>
              <div className="flex justify-between py-2 mt-2">
                <span className="font-bold text-foreground">Total Final</span>
                <span className="font-bold text-emerald-500 text-lg">{fmtCurrency(selectedBudget.total_amount)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Budget Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo Presupuesto" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); handleAction('Crear Presupuesto'); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Cliente *</label>
              <input type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Nombre del cliente" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="correo@cliente.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Fecha de Emisión *</label>
              <input type="date" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2 border-b border-border pb-2">
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Detalle de Productos</label>
                <button type="button" onClick={() => addItemsRow(createItems, setCreateItems)} className="text-[11px] text-primary font-medium hover:underline flex items-center">
                  <Plus className="h-3 w-3 mr-0.5" /> Agregar Producto
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {createItems.map(item => (
                  <div key={item.id} className="flex gap-2 items-center bg-muted/10 p-2 rounded-lg border border-border">
                    <select 
                      value={item.product_id} 
                      onChange={e => updateItemsList(createItems, setCreateItems, item.id, 'product_id', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-input rounded bg-background outline-none text-sm"
                    >
                      <option value="">Seleccionar producto...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} - {fmtCurrency(p.price)}</option>)}
                    </select>
                    <input 
                      type="number" min="1" 
                      value={item.quantity} 
                      onChange={e => updateItemsList(createItems, setCreateItems, item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1.5 border border-input rounded bg-background outline-none text-sm"
                      placeholder="Cant."
                    />
                    <div className="w-24 text-right text-sm font-semibold text-foreground">
                      {fmtCurrency(item.quantity * item.unit_price)}
                    </div>
                    <button type="button" onClick={() => removeItemsRow(createItems, setCreateItems, item.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="h-4 w-4"/></button>
                  </div>
                ))}
                {createItems.length === 0 && <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded-lg border border-dashed border-border">No hay productos agregados.</p>}
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-border">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Monto Total</p>
                  <p className="text-lg font-bold text-emerald-500">{fmtCurrency(createTotal)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Estado</label>
              <select className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                <option value="draft">Borrador</option>
                <option value="sent">Enviado</option>
                <option value="accepted">Aceptado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Condiciones</label>
            <textarea className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={3} placeholder="Condiciones de pago, validez..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all">
              Crear
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Presupuesto" size="lg">
        {selectedBudget && (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); handleAction('Guardar Cambios de Presupuesto'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Cliente *</label>
                <input type="text" defaultValue={selectedBudget.customer_name} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" defaultValue={selectedBudget.customer_email} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" />
              </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2 border-b border-border pb-2">
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Detalle de Productos</label>
                <button type="button" onClick={() => addItemsRow(editItems, setEditItems)} className="text-[11px] text-primary font-medium hover:underline flex items-center">
                  <Plus className="h-3 w-3 mr-0.5" /> Agregar Producto
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {editItems.map(item => (
                  <div key={item.id} className="flex gap-2 items-center bg-muted/10 p-2 rounded-lg border border-border">
                    <select 
                      value={item.product_id} 
                      onChange={e => updateItemsList(editItems, setEditItems, item.id, 'product_id', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-input rounded bg-background outline-none text-sm"
                    >
                      <option value="">Producto genérico / anterior</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} - {fmtCurrency(p.price)}</option>)}
                    </select>
                    <input 
                      type="number" min="1" 
                      value={item.quantity} 
                      onChange={e => updateItemsList(editItems, setEditItems, item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1.5 border border-input rounded bg-background outline-none text-sm"
                      placeholder="Cant."
                    />
                    <div className="w-24 text-right text-sm font-semibold text-foreground">
                      {fmtCurrency(item.quantity * item.unit_price)}
                    </div>
                    <button type="button" onClick={() => removeItemsRow(editItems, setEditItems, item.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="h-4 w-4"/></button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-border">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Monto Total</p>
                  <p className="text-lg font-bold text-emerald-500">{fmtCurrency(editTotal)}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Estado</label>
              <select defaultValue={selectedBudget.status} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm">
                <option value="draft">Borrador</option>
                <option value="sent">Enviado</option>
                <option value="accepted">Aceptado</option>
                <option value="rejected">Rechazado</option>
                <option value="expired">Vencido</option>
              </select>
            </div>
          </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Condiciones</label>
              <textarea defaultValue={selectedBudget.conditions} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={3} />
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
