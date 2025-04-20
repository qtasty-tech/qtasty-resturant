
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

// Mock data
const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    available: true,
  },
  {
    id: '2',
    name: 'Chicken Caesar Salad',
    description: 'Romaine lettuce, grilled chicken, parmesan, croutons with Caesar dressing',
    price: 10.99,
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    available: true,
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on thin crust',
    price: 14.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    available: true,
  },
  {
    id: '4',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 6.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    available: true,
  },
  {
    id: '5',
    name: 'French Fries',
    description: 'Crispy golden fries with ketchup and mayonnaise',
    price: 4.99,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    available: true,
  }
];

const categories = ['All', 'Mains', 'Sides', 'Salads', 'Desserts', 'Drinks'];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Mains',
    image: '',
    available: true,
  });

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        [name]: name === 'price' ? parseFloat(value) : value,
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: name === 'price' ? parseFloat(value) : value,
      });
    }
  };

  const handleAvailabilityChange = (checked: boolean) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        available: checked,
      });
    } else {
      setNewItem({
        ...newItem,
        available: checked,
      });
    }
  };

  const handleAddItem = () => {
    const newId = Date.now().toString();
    const itemToAdd = { id: newId, ...newItem };
    setMenuItems([...menuItems, itemToAdd]);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'Mains',
      image: '',
      available: true,
    });
    setIsAddDialogOpen(false);
    toast({
      title: 'Menu Item Added',
      description: `${newItem.name} has been added to your menu.`,
    });
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      setMenuItems(menuItems.map(item => 
        item.id === selectedItem.id ? selectedItem : item
      ));
      setSelectedItem(null);
      toast({
        title: 'Menu Item Updated',
        description: `${selectedItem.name} has been updated.`,
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = menuItems.find(item => item.id === id);
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: 'Menu Item Removed',
      description: `${itemToDelete?.name} has been removed from your menu.`,
      variant: 'destructive',
    });
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem({...item});
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Menu Management"
        description="Add, edit, or remove items from your menu"
      >
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </PageHeader>

      <Tabs defaultValue="All" className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`overflow-hidden ${!item.available ? 'opacity-70' : ''}`}>
                <div className="relative h-48 w-full">
                  <img 
                    src={item.image || '/placeholder.svg'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 bg-accent hover:bg-accent/90"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {!item.available && (
                    <div className="absolute top-0 left-0 bg-gray-800/80 text-white px-3 py-1 text-sm">
                      Unavailable
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center">
                      <Switch 
                        checked={item.available} 
                        onCheckedChange={(checked) => {
                          const updatedItems = menuItems.map(i => 
                            i.id === item.id ? {...i, available: checked} : i
                          );
                          setMenuItems(updatedItems);
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">Add your first menu item in this category.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Item
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add New Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Add details about your new menu item below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="e.g. Classic Cheeseburger"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                placeholder="Describe your menu item..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categories.filter(c => c !== 'All').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={newItem.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="available"
                checked={newItem.available}
                onCheckedChange={handleAvailabilityChange}
              />
              <Label htmlFor="available">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add to Menu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of your menu item.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={selectedItem.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={selectedItem.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={selectedItem.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    name="category"
                    value={selectedItem.category}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.filter(c => c !== 'All').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={selectedItem.image}
                  onChange={handleInputChange}
                />
                <div className="h-32 mt-2 rounded overflow-hidden">
                  <img 
                    src={selectedItem.image || '/placeholder.svg'} 
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-available"
                  checked={selectedItem.available}
                  onCheckedChange={handleAvailabilityChange}
                />
                <Label htmlFor="edit-available">Available</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
