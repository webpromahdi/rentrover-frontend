"use client";
import type { ElementType, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeDollarSign,
  Box,
  ChevronDown,
  ImageIcon,
  Loader2,
  MapPin,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getProviderCategoriesAction } from "../_actions/categoryActions";
import {
  createProviderGearAction,
  updateProviderGearAction,
  type CreateProviderGearPayload,
} from "../_actions/gearActions";
import Availability from "@/components/shared/Availability";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const conditions = ["NEW", "EXCELLENT", "GOOD", "FAIR", "POOR"] as const;

const GearSchema = z.object({
  name: z.string().trim().min(2, "Gear name must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  brand: z.string().trim().min(2, "Brand must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  pricePerDay: z
    .number({ message: "Price per day is required" })
    .positive("Price per day must be greater than 0"),
  stock: z
    .number({ message: "Stock is required" })
    .int("Stock must be a whole number")
    .min(1, "Stock must be at least 1"),
  condition: z.enum(conditions, { error: "Please select a condition" }),
  address: z.string().trim().optional(),
  image: z.string().trim().url("Enter a valid image URL"),
  availability: z.boolean(),
});

type GearFormValues = z.output<typeof GearSchema>;

const ProviderGearForm = ({
  edit = false,
  gearId,
  initialValues,
}: {
  edit?: boolean;
  gearId?: string;
  initialValues?: GearFormValues;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const title = edit ? "Edit Gear" : "List New Gear";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GearFormValues>({
    resolver: zodResolver(GearSchema),
    defaultValues:
      initialValues ||
      ({
        name: "",
        description: "",
        brand: "",
        categoryId: "",
        pricePerDay: 0,
        stock: 1,
        condition: "NEW",
        address: "",
        image: "",
        availability: true,
      } as unknown as GearFormValues),
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const { data, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["provider-categories"],
    queryFn: getProviderCategoriesAction,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateProviderGearPayload) =>
      createProviderGearAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
      toast.success("Gear listing created successfully");
      reset();
      router.push("/dashboard/provider/gear");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create gear listing");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<CreateProviderGearPayload>) =>
      updateProviderGearAction(gearId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
      toast.success("Gear listing updated successfully");
      reset();
      router.push("/dashboard/provider/gear");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update gear listing");
    },
  });

  const categories = data ?? [];
  const availability = watch("availability");

  const onSubmit = (values: GearFormValues) => {
    const payload = {
      ...values,
      address: values.address || undefined,
    };
    if (edit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload as CreateProviderGearPayload);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f9fbff_0%,#f4f7fb_100%)] p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-start gap-5">
          <Link
            href="/dashboard/provider/gear"
            aria-label="Back to My Gear"
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#15213d]"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="pt-0.5">
            <h1 className="text-[32px] font-extrabold leading-tight text-[#15213d]">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-slate-500">
              {edit
                ? "Update your gear details and availability."
                : "Add your gear details to list it for rent and start earning."}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <Card className={cardClassName}>
            <SectionHeading
              icon={Box}
              iconClassName="bg-primary/10 text-primary"
              title="Gear Information"
              description="Core listing details"
            />
            <div className="mt-8 grid gap-x-7 gap-y-6 md:grid-cols-2">
              <Field
                label="Gear Name"
                required
                error={errors.name?.message}
                className="md:col-span-2"
              >
                <Input {...register("name")} className={inputClassName} />
              </Field>
              <Field
                label="Description"
                required
                error={errors.description?.message}
                className="md:col-span-2"
              >
                <Textarea
                  {...register("description")}
                  className={`${textareaClassName} min-h-36 resize-y p-4`}
                />
              </Field>
              <Field label="Brand" required error={errors.brand?.message}>
                <Input {...register("brand")} className={inputClassName} />
              </Field>
              <Field
                label="Category"
                required
                error={errors.categoryId?.message}
              >
                <SelectShell>
                  <select
                    {...register("categoryId")}
                    className={selectClassName}
                    disabled={isCategoriesLoading}
                  >
                    <option value="" disabled hidden />
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </SelectShell>
                {isCategoriesLoading && (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Loading categories...
                  </p>
                )}
              </Field>
            </div>
          </Card>

          <Card className={cardClassName}>
            <SectionHeading
              icon={BadgeDollarSign}
              iconClassName="bg-emerald-50 text-emerald-600"
              title="Pricing & Inventory"
              description="Rental terms and availability"
            />
            <div className="mt-8 grid gap-x-7 gap-y-6 md:grid-cols-2">
              <Field
                label="Price Per Day ($)"
                required
                error={errors.pricePerDay?.message}
              >
                <div className="flex overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-red-100/70">
                  <span className="flex h-12 w-11 items-center justify-center border-r border-slate-200/80 bg-slate-50 text-sm font-semibold text-slate-600">
                    $
                  </span>
                  <Input
                    {...register("pricePerDay", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="h-12 rounded-none border-0 bg-white px-4 text-sm text-[#15213d] shadow-none focus-visible:border-0 focus-visible:ring-0"
                  />
                </div>
              </Field>
              <Field label="Stock" required error={errors.stock?.message}>
                <Input
                  {...register("stock", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className={inputClassName}
                />
              </Field>
              <Field
                label="Condition"
                required
                error={errors.condition?.message}
              >
                <SelectShell>
                  <select
                    {...register("condition")}
                    className={selectClassName}
                  >
                    <option value="" disabled hidden />
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </SelectShell>
              </Field>
              <button
                type="button"
                onClick={() =>
                  setValue("availability", !availability, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="flex min-h-12 items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-bold text-[#15213d]">
                    Availability
                  </p>
                  <p className="mt-1 text-xs leading-4 text-slate-500">
                    Make available for rent immediately
                  </p>
                </div>
                <Availability active={availability} />
              </button>
            </div>
          </Card>

          <Card className={cardClassName}>
            <SectionHeading
              icon={MapPin}
              iconClassName="bg-amber-50 text-amber-500"
              title="Pickup Details"
              description="Customer pickup location"
            />
            <div className="mt-8">
              <Field label="Pickup Address" error={errors.address?.message}>
                <Input {...register("address")} className={inputClassName} />
              </Field>
            </div>
          </Card>

          <Card className={cardClassName}>
            <SectionHeading
              icon={ImageIcon}
              iconClassName="bg-violet-50 text-violet-600"
              title="Media"
              description="Listing image source"
            />
            <div className="mt-8">
              <Field label="Image URL" required error={errors.image?.message}>
                <Input {...register("image")} className={inputClassName} />
              </Field>
            </div>
          </Card>

          <footer className="flex flex-col gap-4 pb-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-500">
              * Required fields
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                render={<Link href="/dashboard/provider/gear" />}
                variant="secondary"
                size="xl"
                className="rounded-xl border-slate-200/90 shadow-[0_4px_14px_rgba(15,23,42,0.04)] hover:border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="h-12 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-[0_10px_22px_rgba(227,24,36,0.20)] transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {edit ? "Updating..." : "Submitting..."}
                  </>
                ) : edit ? (
                  "Update Gear Listing"
                ) : (
                  "Submit Gear Listing"
                )}
              </Button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

const cardClassName = "gap-0";

const inputClassName =
  "h-12 rounded-xl border border-slate-200/90 bg-white px-4 text-sm text-[#15213d] shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all focus:border-primary focus:ring-4 focus:ring-red-100/70";

const textareaClassName =
  "rounded-xl border border-slate-200/90 bg-white text-sm text-[#15213d] shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all focus:border-primary focus:ring-4 focus:ring-red-100/70";

const selectClassName =
  "h-12 w-full appearance-none rounded-xl border border-slate-200/90 bg-white px-4 pr-11 text-sm text-[#15213d] shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-100/70";

const Field = ({
  label,
  required = false,
  error,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) => (
  <label className={`block ${className}`}>
    <span className="mb-2.5 block text-sm font-bold text-[#15213d]">
      {label}
      {required && <span className="ml-1 text-primary">*</span>}
    </span>
    {children}
    {error && (
      <p className="mt-2 text-xs font-semibold text-primary">{error}</p>
    )}
  </label>
);

const SelectShell = ({ children }: { children: ReactNode }) => (
  <div className="relative">
    {children}
    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
  </div>
);

const SectionHeading = ({
  icon: Icon,
  iconClassName,
  title,
  description,
}: {
  icon: ElementType;
  iconClassName: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-center gap-4 border-b border-border pb-6">
    <span
      className={`flex size-11 items-center justify-center rounded-2xl ${iconClassName}`}
    >
      <Icon className="size-5" />
    </span>
    <div>
      <h2 className="text-lg font-extrabold leading-6 text-[#15213d]">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
    </div>
  </div>
);

export default ProviderGearForm;
