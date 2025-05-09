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
import { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  popular: boolean;
  calories: string;
}

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: MenuItem | null;
  categories: string[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onAvailabilityChange: (checked: boolean) => void;
  onPopularChange: (checked: boolean) => void;
  onUpdateItem: (imageFile?: File) => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  isOpen,
  onClose,
  selectedItem,
  categories,
  onInputChange,
  onAvailabilityChange,
  onPopularChange,
  onUpdateItem,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Update previewImage when selectedItem changes or modal opens
  useEffect(() => {
    if (isOpen && selectedItem?.imageUrl) {
      setPreviewImage(`${selectedItem.imageUrl}?t=${new Date().getTime()}`);
      setSelectedFile(null); // Reset selected file when modal opens
    } else {
      setPreviewImage(null);
    }
  }, [isOpen, selectedItem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("EditItemDialog - Selected file:", file);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Revert to original image if no file is selected
      setSelectedFile(null);
      setPreviewImage(
        selectedItem?.imageUrl
          ? `${selectedItem.imageUrl}?t=${new Date().getTime()}`
          : null
      );
    }
  };

  const handleSubmit = () => {
    console.log("EditItemDialog - Submitting with file:", selectedFile);
    onUpdateItem(selectedFile || undefined);
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update the details of your menu item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Item Name</Label>
            <Input
              id="edit-name"
              name="name"
              value={selectedItem.name}
              onChange={onInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={selectedItem.description}
              onChange={onInputChange}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={selectedItem.price}
                onChange={onInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-calories">Calories</Label>
              <Input
                id="edit-calories"
                name="calories"
                value={selectedItem.calories}
                onChange={onInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                name="category"
                value={selectedItem.category || ""}
                onChange={onInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <Label htmlFor="edit-image">Item Image</Label>
            <Input
              id="edit-image"
              name="image"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
            />
            {previewImage && (
              <div className="h-32 mt-2 rounded overflow-hidden">
                <img
                  src={previewImage}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="edit-popular"
                checked={selectedItem.popular}
                onCheckedChange={onPopularChange}
                className="data-[state=checked]:bg-yellow-500"
              />
              <Label htmlFor="edit-popular">Popular</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="edit-available"
                checked={selectedItem.available}
                onCheckedChange={onAvailabilityChange}
              />
              <Label htmlFor="edit-available">Available</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
