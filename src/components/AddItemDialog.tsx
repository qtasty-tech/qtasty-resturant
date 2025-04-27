// src/components/AddItemDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
  calories: string;
}

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newItem: Omit<MenuItem, "_id">;
  categories: string[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onPopularChange: (checked: boolean) => void;
  onAddItem: () => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onClose,
  newItem,
  categories,
  onInputChange,
  onPopularChange,
  onAddItem,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Add details about your new menu item below. Name, price and category are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onAddItem();
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                value={newItem.name}
                onChange={onInputChange}
                placeholder="e.g. Classic Cheeseburger"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={onInputChange}
                placeholder="Describe your menu item..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price || ''}
                  onChange={onInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  name="calories"
                  value={newItem.calories}
                  onChange={onInputChange}
                  placeholder="e.g. 500 cal"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={newItem.category}
                  onChange={onInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
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
                onChange={onInputChange}
                placeholder="https://example.com/image.jpg"
              />
              {newItem.image && (
                <div className="mt-2 rounded-md overflow-hidden border">
                  <img
                    src={newItem.image}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="popular"
                checked={newItem.popular}
                onCheckedChange={onPopularChange}
                className="data-[state=checked]:bg-yellow-500"
              />
              <Label htmlFor="popular">Mark as Popular</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add to Menu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;