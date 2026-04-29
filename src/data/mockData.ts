export const mockUsers = [
  { id: 'u1', full_name: 'Admin User', role: 'admin', email: 'admin@crm.com' },
  { id: 'u2', full_name: 'Santiago Vendedor', role: 'seller', email: 'santiago@crm.com' },
  { id: 'u3', full_name: 'Lucia Vendedora', role: 'seller', email: 'lucia@crm.com' },
];

export const mockCategories = [
  { id: 'c1', name: 'PISCINAS' },
  { id: 'c2', name: 'ACCESORIOS' },
  { id: 'c3', name: 'PRODUCTOS PARA PISCINAS' },
  { id: 'c4', name: 'REPUESTOS' },
  { id: 'c5', name: 'ELECTROBOMBAS' },
  { id: 'c6', name: 'PISOS ATERMICOS' },
];

export const mockProducts = [
  { id: 'p1', category_id: 'c1', name: 'Piscina Familiar 6x3', price: 2500000, stock: 5 },
  { id: 'p2', category_id: 'c1', name: 'Piscina Premium 8x4', price: 4200000, stock: 2 },
  { id: 'p3', category_id: 'c1', name: 'Piscina Compacta 4x2', price: 1800000, stock: 8 },
  { id: 'p4', category_id: 'c3', name: 'Cloro Granulado 10kg', price: 25000, stock: 40 },
  { id: 'p5', category_id: 'c2', name: 'Limpiafondo Manual', price: 45000, stock: 12 },
  { id: 'p6', category_id: 'c2', name: 'Barrefondo Automático', price: 120000, stock: 5 },
  { id: 'p7', category_id: 'c5', name: 'Bomba 1 HP Vulcano', price: 180000, stock: 15 },
  { id: 'p8', category_id: 'c4', name: 'Repuesto Skimmer', price: 12000, stock: 25 },
];

export const mockStages = [
  { id: 's1', name: 'Nuevo contacto', position: 1 },
  { id: 's2', name: 'Contactado', position: 2 },
  { id: 's3', name: 'Presupuesto enviado', position: 3 },
  { id: 's4', name: 'Negociación', position: 4 },
  { id: 's5', name: 'Ganado', position: 5 },
  { id: 's6', name: 'Perdido', position: 6 },
];

export const mockContacts = [
  { id: 'ct1', first_name: 'Juan', last_name: 'Pérez', phone: '1122334455', email: 'juan@test.com', city: 'CABA' },
  { id: 'ct2', first_name: 'María', last_name: 'Gómez', phone: '1155443322', email: 'maria@test.com', city: 'Rosario' },
  { id: 'ct3', first_name: 'Carlos', last_name: 'López', phone: '1144332211', email: 'carlos@test.com', city: 'Córdoba' },
  { id: 'ct4', first_name: 'Ana', last_name: 'Martínez', phone: '1166778899', email: 'ana@test.com', city: 'Mendoza' },
  { id: 'ct5', first_name: 'Pedro', last_name: 'Sánchez', phone: '1199887766', email: 'pedro@test.com', city: 'La Plata' },
  { id: 'ct6', first_name: 'Laura', last_name: 'Fernández', phone: '1133224455', email: 'laura@test.com', city: 'Mar del Plata' },
  { id: 'ct7', first_name: 'Diego', last_name: 'García', phone: '1177665544', email: 'diego@test.com', city: 'Neuquén' },
  { id: 'ct8', first_name: 'Sofía', last_name: 'Rodríguez', phone: '1188552233', email: 'sofia@test.com', city: 'Salta' },
];

export const mockLeads = [
  { id: 'l1', lead_code: 'LEAD-0001', contact_id: 'ct1', first_name: 'Juan', last_name: 'Pérez', city: 'CABA', product_interest: 'Piscina Familiar 6x3', estimated_amount: 2500000, pipeline_stage_id: 's1', assigned_user_id: 'u2', status: 'active', source: 'WhatsApp', created_at: '2026-04-25T10:00:00Z' },
  { id: 'l2', lead_code: 'LEAD-0002', contact_id: 'ct2', first_name: 'María', last_name: 'Gómez', city: 'Rosario', product_interest: 'Piscina Premium 8x4', estimated_amount: 4200000, pipeline_stage_id: 's3', assigned_user_id: 'u3', status: 'active', source: 'Instagram', created_at: '2026-04-24T11:00:00Z' },
  { id: 'l3', lead_code: 'LEAD-0003', contact_id: 'ct3', first_name: 'Carlos', last_name: 'López', city: 'Córdoba', product_interest: 'Piscina Compacta 4x2', estimated_amount: 1800000, pipeline_stage_id: 's4', assigned_user_id: 'u2', status: 'active', source: 'Web', created_at: '2026-04-23T09:30:00Z' },
  { id: 'l4', lead_code: 'LEAD-0004', contact_id: 'ct4', first_name: 'Ana', last_name: 'Martínez', city: 'Mendoza', product_interest: 'Revestimiento', estimated_amount: 300000, pipeline_stage_id: 's2', assigned_user_id: 'u3', status: 'active', source: 'Recomendación', created_at: '2026-04-22T14:15:00Z' },
  { id: 'l5', lead_code: 'LEAD-0005', contact_id: 'ct5', first_name: 'Pedro', last_name: 'Sánchez', city: 'La Plata', product_interest: 'Bomba 1 HP', estimated_amount: 180000, pipeline_stage_id: 's5', assigned_user_id: 'u2', status: 'active', source: 'WhatsApp', created_at: '2026-04-21T16:45:00Z' },
  { id: 'l6', lead_code: 'LEAD-0006', contact_id: 'ct6', first_name: 'Laura', last_name: 'Fernández', city: 'Mar del Plata', product_interest: 'Piscina Premium 8x4', estimated_amount: 4200000, pipeline_stage_id: 's1', assigned_user_id: 'u3', status: 'active', source: 'Instagram', created_at: '2026-04-26T10:20:00Z' },
  { id: 'l7', lead_code: 'LEAD-0007', contact_id: 'ct7', first_name: 'Diego', last_name: 'García', city: 'Neuquén', product_interest: 'Cloro', estimated_amount: 50000, pipeline_stage_id: 's6', assigned_user_id: 'u2', status: 'active', source: 'Web', created_at: '2026-04-20T08:10:00Z' },
  { id: 'l8', lead_code: 'LEAD-0008', contact_id: 'ct8', first_name: 'Sofía', last_name: 'Rodríguez', city: 'Salta', product_interest: 'Barrefondo', estimated_amount: 120000, pipeline_stage_id: 's3', assigned_user_id: 'u3', status: 'active', source: 'Web', created_at: '2026-04-27T15:30:00Z' },
  { id: 'l9', lead_code: 'LEAD-0009', contact_id: 'ct1', first_name: 'Juan', last_name: 'Pérez', city: 'CABA', product_interest: 'Borde Atérmico', estimated_amount: 170000, pipeline_stage_id: 's2', assigned_user_id: 'u2', status: 'active', source: 'WhatsApp', created_at: '2026-04-28T09:00:00Z' },
  { id: 'l10', lead_code: 'LEAD-0010', contact_id: 'ct2', first_name: 'María', last_name: 'Gómez', city: 'Rosario', product_interest: 'Limpiafondo Manual', estimated_amount: 45000, pipeline_stage_id: 's5', assigned_user_id: 'u3', status: 'active', source: 'Correo', created_at: '2026-04-28T10:15:00Z' },
];

export const mockBudgets = [
  { id: 'b1', budget_code: 'PRES-0001', lead_id: 'l2', customer_name: 'María Gómez', total_amount: 4200000, status: 'sent', issue_date: '2026-04-24' },
  { id: 'b2', budget_code: 'PRES-0002', lead_id: 'l3', customer_name: 'Carlos López', total_amount: 1800000, status: 'accepted', issue_date: '2026-04-23' },
  { id: 'b3', budget_code: 'PRES-0003', lead_id: 'l4', customer_name: 'Ana Martínez', total_amount: 300000, status: 'draft', issue_date: '2026-04-25' },
  { id: 'b4', budget_code: 'PRES-0004', lead_id: 'l5', customer_name: 'Pedro Sánchez', total_amount: 180000, status: 'accepted', issue_date: '2026-04-21' },
  { id: 'b5', budget_code: 'PRES-0005', lead_id: 'l8', customer_name: 'Sofía Rodríguez', total_amount: 120000, status: 'sent', issue_date: '2026-04-27' },
  { id: 'b6', budget_code: 'PRES-0006', lead_id: 'l10', customer_name: 'María Gómez', total_amount: 45000, status: 'accepted', issue_date: '2026-04-28' },
];

export const mockEvents = [
  { id: 'e1', title: 'Llamar a Juan', lead_id: 'l1', event_type: 'call', due_at: '2026-04-29T10:00:00Z', status: 'pending', assigned_user_id: 'u2' },
  { id: 'e2', title: 'Reunión María', lead_id: 'l2', event_type: 'meeting', due_at: '2026-04-30T15:00:00Z', status: 'pending', assigned_user_id: 'u3' },
  { id: 'e3', title: 'Visita técnica Carlos', lead_id: 'l3', event_type: 'technical_visit', due_at: '2026-04-24T11:00:00Z', status: 'completed', assigned_user_id: 'u2' },
  { id: 'e4', title: 'Enviar presu Ana', lead_id: 'l4', event_type: 'budget_send', due_at: '2026-04-27T09:00:00Z', status: 'completed', assigned_user_id: 'u3' },
  { id: 'e5', title: 'Cierre Pedro', lead_id: 'l5', event_type: 'closing', due_at: '2026-04-22T14:00:00Z', status: 'completed', assigned_user_id: 'u2' },
  { id: 'e6', title: 'Llamar Laura', lead_id: 'l6', event_type: 'call', due_at: '2026-04-26T16:00:00Z', status: 'expired', assigned_user_id: 'u3' },
  { id: 'e7', title: 'Seguimiento Sofía', lead_id: 'l8', event_type: 'follow_up', due_at: '2026-04-28T11:00:00Z', status: 'pending', assigned_user_id: 'u3' },
  { id: 'e8', title: 'Reunión Juan', lead_id: 'l9', event_type: 'meeting', due_at: '2026-04-28T14:30:00Z', status: 'pending', assigned_user_id: 'u2' },
];
