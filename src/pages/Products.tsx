import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, createCategory } from '../lib/api';
import type { Product, Category } from '../lib/api';
import { Search, Plus, Edit2, Trash2, Package, Upload, X } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<Category[]>([]);
useEffect(() => {
  const loadData = async () => {
    const prod = await fetchProducts();
    const cat = await fetchCategories();
    setProducts(prod);
    setCategories(cat);
  };
  loadData();
}, []);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter ? p.category_id === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSubmittingCat(true);
    
    if (editingCategory) {
      // In a real app we'd call an updateCategory API
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: newCategoryName } : c));
      alert("Categoría actualizada (Simulado)");
    } else {
      const newCat = await createCategory(newCategoryName.trim());
      if (newCat) {
        setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        alert("Error al crear la categoría.");
      }
    }
    
    setShowCategoryModal(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setIsSubmittingCat(false);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('¿Eliminar esta categoría? Esto no eliminará los productos asociados, pero quedarán sin categoría.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image_url || null);
    setShowCreateModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      category_id: formData.get('category_id') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      description: formData.get('description') as string,
      image_url: imagePreview || undefined
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
      alert("Producto actualizado");
    } else {
      const newProd: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...productData as Omit<Product, 'id'>
      };
      setProducts(prev => [...prev, newProd]);
      alert("Producto creado");
    }

    setShowCreateModal(false);
    setEditingProduct(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fmtCurrency = (n: number) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Productos y Categorías</h2>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setActiveTab('products')}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Productos ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Categorías ({categories.length})
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          {activeTab === 'categories' && (
            <button 
              onClick={() => { setEditingCategory(null); setNewCategoryName(''); setShowCategoryModal(true); }}
              className="flex items-center px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-all text-sm border border-border"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </button>
          )}
          <button 
            onClick={() => { setEditingProduct(null); setImagePreview(null); setShowCreateModal(true); }}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 border-b border-border flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/30 outline-none text-sm transition-all"
              />
            </div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 bg-background border border-input rounded-lg outline-none text-sm focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas las categorías</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-medium">Producto</th>
                  <th className="px-6 py-3.5 font-medium">Categoría</th>
                  <th className="px-6 py-3.5 font-medium text-right">Precio</th>
                  <th className="px-6 py-3.5 font-medium text-right">Stock</th>
                  <th className="px-6 py-3.5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map(product => {
                  const category = categories.find(c => c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex items-center justify-center ring-1 ring-border">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <span className="font-medium text-sm text-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{category?.name || 'Sin categoría'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                        {fmtCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}>
                          {product.stock} unidades
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors">
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
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-medium">Nombre de la Categoría</th>
                  <th className="px-6 py-3.5 font-medium">Productos Asociados</th>
                  <th className="px-6 py-3.5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map(category => {
                  const associatedCount = products.filter(p => p.category_id === category.id).length;
                  return (
                    <tr key={category.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm text-foreground">{category.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-muted-foreground">{associatedCount} productos</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditCategory(category)}
                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors">
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
      )}

      {/* Create Product Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setEditingProduct(null); setImagePreview(null); }} title={editingProduct ? "Editar Producto" : "Nuevo Producto"} size="lg">
        <form className="space-y-5" onSubmit={handleProductSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre *</label>
              <input name="name" type="text" defaultValue={editingProduct?.name} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="Piscina Familiar 6x3" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría *</label>
                <button type="button" onClick={() => setShowCategoryModal(true)} className="text-[10px] text-primary font-medium hover:underline flex items-center">
                  <Plus className="h-3 w-3 mr-0.5" /> Nueva
                </button>
              </div>
              <select name="category_id" defaultValue={editingProduct?.category_id || ''} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" required>
                <option value="">Seleccionar...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">SKU</label>
              <input name="sku" type="text" className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="PISC-001" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Precio *</label>
              <input name="price" type="number" defaultValue={editingProduct?.price} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="2500000" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Stock</label>
              <input name="stock" type="number" defaultValue={editingProduct?.stock} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" placeholder="10" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Imagen del Producto</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-input rounded-xl hover:border-primary/50 transition-colors group relative overflow-hidden bg-muted/20">
                {imagePreview ? (
                  <div className="relative w-full aspect-video">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <button 
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="flex text-sm text-muted-foreground">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-semibold text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>Cargar un archivo</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Descripción</label>
            <textarea name="description" defaultValue={editingProduct?.description} className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm resize-none" rows={3} placeholder="Descripción del producto..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => { setShowCreateModal(false); setEditingProduct(null); setImagePreview(null); }} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all">
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Category Modal */}
      <Modal isOpen={showCategoryModal} onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }} title={editingCategory ? "Editar Categoría" : "Nueva Categoría"} size="sm">
        <form className="space-y-5" onSubmit={handleCreateCategory}>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Nombre de la Categoría *</label>
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/30 outline-none text-sm" 
              placeholder="Ej. Bombas de Agua" 
              required 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmittingCat}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50"
            >
              {isSubmittingCat ? 'Guardando...' : editingCategory ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
