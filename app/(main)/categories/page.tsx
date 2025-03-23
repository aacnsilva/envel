"use client";

import { useState } from "react";
import { PlusCircle, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock categories - would come from API in real app
const mockCategories = [
  { id: 1, name: "Groceries", description: "Food and household supplies" },
  { id: 2, name: "Utilities", description: "Electricity, water, gas, etc." },
  { id: 3, name: "Dining Out", description: "Restaurants and cafes" },
  { id: 4, name: "Entertainment", description: "Movies, concerts, events" },
  { id: 5, name: "Transportation", description: "Gas, public transit, rideshares" },
  { id: 6, name: "Shopping", description: "Clothes, electronics, etc." },
  { id: 7, name: "Healthcare", description: "Doctor visits, medicine, etc." },
  { id: 8, name: "Personal Care", description: "Haircuts, gym, etc." },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<typeof mockCategories[0] | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (category: typeof mockCategories[0]) => {
    setEditCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Deleting category:", deleteId);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update local state
      setCategories(categories.filter(cat => cat.id !== deleteId));
      
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Adding category:", newCategory);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update local state
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories([...categories, { id: newId, ...newCategory }]);
      
      toast.success("Category added successfully");
      
      // Reset form
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setIsSubmitting(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Updating category:", editCategory);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Update local state
      setCategories(categories.map(cat => 
        cat.id === editCategory.id ? editCategory : cat
      ));
      
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
      setIsEditDialogOpen(false);
      setEditCategory(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for organizing your spending.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g. Groceries"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  placeholder="e.g. Food and household supplies"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="sm:w-auto w-full mt-2 sm:mt-0"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddCategory}
                disabled={isSubmitting}
                className="sm:w-auto w-full"
              >
                {isSubmitting ? "Adding..." : "Add Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Manage Categories</CardTitle>
          <CardDescription>
            Categories help you organize your spending entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                      <div className="text-xs text-muted-foreground sm:hidden mt-1 pr-4">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{category.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(category)}
                          className="h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive h-8 w-8 p-0"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          {editCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="edit-name"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={editCategory.description}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="sm:w-auto w-full mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCategory}
              disabled={isSubmitting}
              className="sm:w-auto w-full"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 