import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AddItemDialog from '@/components/AddItemDialog';
import EditItemDialog from '@/components/EditItemDialog';

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

      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        newItem={newItem}
        categories={categories}
        onInputChange={handleInputChange}
        onAvailabilityChange={handleAvailabilityChange}
        onAddItem={handleAddItem}
      />

      <EditItemDialog
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        selectedItem={selectedItem}
        categories={categories}
        onInputChange={handleInputChange}
        onAvailabilityChange={handleAvailabilityChange}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
};

export default MenuManagement;