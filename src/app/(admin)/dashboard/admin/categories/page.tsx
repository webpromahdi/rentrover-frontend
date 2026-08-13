"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/(admin)/_actions/categoryActions";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

type Category = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });

  const createMutation = useMutation({
    mutationFn: createCategoryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully");
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CategoryFormValues;
    }) => updateCategoryAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description || "");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    reset();
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const categories: Category[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : Array.isArray(data?.data?.categories)
        ? data.data.categories
        : [];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-5 sm:p-8">
      <PageHeading title="Category Management" />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                All Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {categories.length} categories
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,.06)]">
            <Table className="min-w-[700px] w-full text-left text-sm">
              <TableHeader className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[.08em] text-slate-500">
                <TableRow>
                  {[
                    "#",
                    "Category Name",
                    "Description",
                    "Created",
                    "Actions",
                  ].map((x) => (
                    <TableHead key={x} className="px-4 py-4">
                      {x}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-4 text-center">
                      <div className="flex justify-center items-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#e31824]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="p-8 text-center text-slate-400 text-sm"
                    >
                      No categories found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category, i) => (
                    <TableRow
                      key={category.id}
                      className={`border-b border-border last:border-0 transition-colors ${
                        editingCategory?.id === category.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <TableCell className="px-4 py-3 text-slate-500">
                        {i + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-bold text-foreground">
                        {category.name}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-slate-500 max-w-[250px] truncate"
                        title={category.description || ""}
                      >
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-slate-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="rounded-lg border border-blue-600 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(category.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded-lg border border-primary px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                          >
                            {deleteMutation.isPending ? "..." : "Delete"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <aside className="lg:mt-16 lg:col-span-1 h-fit rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,.06)]">
          <h2 className="text-xl font-extrabold text-foreground">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          {editingCategory && (
            <p className="mt-1 text-xs text-blue-600 font-medium">
              Editing: {editingCategory.name}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <label className="block text-sm font-bold text-foreground">
              Name*
              <Input
                {...register("name")}
                placeholder="e.g. Water Sports"
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
              />
            </label>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}

            <label className="mt-5 block text-sm font-bold text-foreground">
              Description
              <Textarea
                {...register("description")}
                placeholder="Brief description of this category..."
                className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm"
              />
            </label>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className={`h-11 w-full rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 ${
                  editingCategory
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {editingCategory ? "Updating..." : "Adding..."}
                  </>
                ) : editingCategory ? (
                  "Update Category"
                ) : (
                  "Add Category"
                )}
              </Button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="h-10 w-full rounded-lg border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-slate-400">
            {editingCategory
              ? "Click Cancel to discard changes."
              : 'Click "Edit" in the table to update an existing category.'}
          </p>
        </aside>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
