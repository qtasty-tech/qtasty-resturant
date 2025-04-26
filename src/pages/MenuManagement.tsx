// src/pages/MenuManagement.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { 
  getMenu, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  toggleMenuItemAvailability 
} from '@/api/menuApi';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddItemDialog from '@/components/AddItemDialog';
import EditItemDialog from '@/components/EditItemDialog';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

const categories = ['All', 'Mains', 'Sides', 'Salads', 'Desserts', 'Drinks'];

const MenuManagement = () => {
  const { id: restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState<Omit<MenuItem, '_id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Mains',
    image: '',
    available: true,
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu(restaurantId!);
        setMenuItems(data);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch menu items',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId, toast]);

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

  const handleAvailabilityChange = async (checked: boolean, itemId: string) => {
    try {
      const updatedItem = await toggleMenuItemAvailability(restaurantId!, itemId, checked);
      setMenuItems(menuItems.map(item => 
        item._id === itemId ? updatedItem : item
      ));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item availability',
        variant: 'destructive',
      });
    }
  };

  const handleAddItem = async () => {
    try {
      const createdItem = await createMenuItem(restaurantId!, newItem);
      setMenuItems([...menuItems, createdItem]);
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
        title: 'Success',
        description: `${newItem.name} has been added to your menu.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add menu item',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    
    try {
      const updatedItem = await updateMenuItem(
        restaurantId!, 
        selectedItem._id, 
        selectedItem
      );
      setMenuItems(menuItems.map(item => 
        item._id === selectedItem._id ? updatedItem : item
      ));
      setSelectedItem(null);
      toast({
        title: 'Success',
        description: `${selectedItem.name} has been updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update menu item',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const itemToDelete = menuItems.find(item => item._id === itemId);
      await deleteMenuItem(restaurantId!, itemId);
      setMenuItems(menuItems.filter(item => item._id !== itemId));
      toast({
        title: 'Success',
        description: `${itemToDelete?.name} has been removed from your menu.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem({...item});
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading menu...</div>;
  }

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
              <Card key={item._id} className={`overflow-hidden ${!item.available ? 'opacity-70' : ''}`}>
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
                      onClick={() => handleDeleteItem(item._id)}
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
                        onCheckedChange={(checked) => handleAvailabilityChange(checked, item._id)}
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
        onAvailabilityChange={(checked) => setNewItem({...newItem, available: checked})}
        onAddItem={handleAddItem}
      />

      <EditItemDialog
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        selectedItem={selectedItem}
        categories={categories}
        onInputChange={handleInputChange}
        onAvailabilityChange={(checked) => selectedItem && setSelectedItem({...selectedItem, available: checked})}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
};

export default MenuManagement;