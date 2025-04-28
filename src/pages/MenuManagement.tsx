// src/pages/MenuManagement.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  toggleMenuItemPopularity,
} from "@/api/menuApi";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import AddItemDialog from "@/components/AddItemDialog";
import EditItemDialog from "@/components/EditItemDialog";
import { Menucategories } from "@/constant";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  popular: boolean;
  calories: string;
}

interface MenuCategory {
  id: number;
  name: string;
  items: MenuItem[];
}

const MenuManagement = () => {
  const { id: restaurantId } = useParams();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    available: true,
    popular: false,
    calories: "",
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu(restaurantId!);
        setCategories(data.categories);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch menu items",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId, toast]);

  const allItems = categories.flatMap((category) => category.items);
  const availableCategories = ["All", ...categories.map((c) => c.name)];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        [name]: name === "price" ? parseFloat(value) : value,
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: name === "price" ? parseFloat(value) : value,
      });
    }
  };

  const handleAvailabilityChange = async (checked: boolean, itemId: string) => {
    try {
      const updatedItem = await toggleAvailability(
        restaurantId!,
        itemId,
        checked
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? { ...item, available: checked } : item
          ),
        }))
      );
      toast({
        title: "Success",
        description: `Availability updated for ${updatedItem.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const handlePopularChange = async (checked: boolean, itemId: string) => {
    try {
      const updatedItem = await toggleMenuItemPopularity(
        restaurantId!,
        itemId,
        checked
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? { ...item, popular: checked } : item
          ),
        }))
      );
      toast({
        title: "Success",
        description: `Popularity status updated for ${updatedItem.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update popularity status",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async () => {
    try {
      setIsLoading(true); // Start loading animation
      const createdItem = await createMenuItem(restaurantId!, newItem);

      let categoryExists = false;
      const updatedCategories = categories.map((category) => {
        if (category.name === newItem.category) {
          categoryExists = true;
          return {
            ...category,
            items: [...category.items, createdItem],
          };
        }
        return category;
      });

      if (!categoryExists) {
        updatedCategories.push({
          id: categories.length + 1,
          name: newItem.category,
          items: [createdItem],
        });
      }

      setCategories(updatedCategories);
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        available: true,
        popular: false,
        calories: "",
      });
      setIsAddDialogOpen(false);

      const data = await getMenu(restaurantId!);
      setCategories(data.categories);

      toast({
        title: "Success",
        description: `${newItem.name} has been added to your menu.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); 
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    try {
      await updateMenuItem(restaurantId!, selectedItem.id, selectedItem);

      setIsLoading(true);
      const data = await getMenu(restaurantId!);
      setCategories(data.categories);
      setIsLoading(false);

      setSelectedItem(null);
      toast({
        title: "Success",
        description: `${selectedItem.name} has been updated.`,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const itemToDelete = allItems.find((item) => item.id === itemId);
      await deleteMenuItem(restaurantId!, itemId);

      setCategories(
        categories
          .map((category) => ({
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          }))
          .filter((category) => category.items.length > 0)
      );

      toast({
        title: "Success",
        description: `${itemToDelete?.name} has been removed from your menu.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem({ ...item });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading menu...
      </div>
    );
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

      <Tabs 
        defaultValue="All" 
        className="mb-8"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <TabsList className="mb-4 flex flex-wrap">
          {availableCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {availableCategories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(category === "All" ? allItems : categories.find(c => c.name === category)?.items || []).map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden ${
                    !item.available ? "opacity-70" : ""
                  }`}
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={item.image || "/placeholder.svg"}
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
                    {item.popular && (
                      <div className="absolute top-12 right-0 bg-yellow-500 text-white px-3 py-1 text-sm flex items-center">
                        <Star className="h-3 w-3 mr-1" /> Popular
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm">
                      ${item.price ? item.price.toFixed(2) : "0.00"}
                    </div>
                    {item.calories && (
                      <div className="absolute bottom-0 right-0 bg-gray-800/80 text-white px-3 py-1 text-sm">
                        {item.calories} cal
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.popular}
                          onCheckedChange={(checked) =>
                            handlePopularChange(checked, item.id)
                          }
                          className="data-[state=checked]:bg-yellow-500"
                        />
                        <Switch
                          checked={item.available}
                          onCheckedChange={(checked) =>
                            handleAvailabilityChange(checked, item.id)
                          }
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(category === "All" 
              ? allItems.length === 0
              : categories.find(c => c.name === category)?.items.length === 0) && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  {category === "All" 
                    ? "Add your first menu item."
                    : `Add your first menu item in ${category} category.`}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Item
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        newItem={newItem}
        categories={Menucategories}
        onInputChange={handleInputChange}
        onPopularChange={(checked) =>
          setNewItem({ ...newItem, popular: checked })
        }
        onAddItem={handleAddItem}
      />

      <EditItemDialog
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        selectedItem={selectedItem}
        categories={categories.map((c) => c.name)}
        onInputChange={handleInputChange}
        onAvailabilityChange={(checked) =>
          selectedItem &&
          setSelectedItem({ ...selectedItem, available: checked })
        }
        onPopularChange={(checked) =>
          selectedItem && setSelectedItem({ ...selectedItem, popular: checked })
        }
        onUpdateItem={handleUpdateItem}
      />
    </div>
  );
};

export default MenuManagement;