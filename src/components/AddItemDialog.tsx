import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newItem: Omit<MenuItem, 'id'>;
  categories: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAvailabilityChange: (checked: boolean) => void;
  onAddItem: () => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onClose,
  newItem,
  categories,
  onInputChange,
  onAvailabilityChange,
  onAddItem,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onChange={onInputChange}
              placeholder="e.g. Classic Cheeseburger"
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
                onChange={onInputChange}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={newItem.category}
                onChange={onInputChange}
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
              onChange={onInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="available"
              checked={newItem.available}
              onCheckedChange={onAvailabilityChange}
            />
            <Label htmlFor="available">Available</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddItem}>Add to Menu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;