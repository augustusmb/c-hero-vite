// import { productsArray, productsMap } from "./messages";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./@/components/ui/select.tsx";
import { Button } from "./@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form.tsx";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext.ts";
import {
  getSerialNumbers,
  deleteSerialNumber,
  addSerialNumber,
} from "./api/user.ts";
import BeatLoader from "react-spinners/BeatLoader";
import { FieldValues, useForm } from "react-hook-form";
import { QueryKeys } from "./utils/QueryKeys.ts";

type ProductSerialNumber = {
  product_id: string;
  serial_number: string;
  user_id: number;
};

const ProductSerialNumberSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const { id } = loggedInUserInfo || {};
  const queryClient = useQueryClient();
  const form = useForm();
  const { watch } = form;
  const serialNumber = watch("serialNumber");

  const deleteSerialNumberMutation = useMutation({
    mutationFn: async ({
      userId,
      serialNumber,
    }: {
      userId: number;
      serialNumber: string;
    }) => {
      deleteSerialNumber({ userId, serialNumber });
    },
    onMutate: async ({ userId, serialNumber }) => {
      const previousData = queryClient.getQueryData([
        QueryKeys.LIST_SERIAL_NUMBERS,
        userId,
      ]);
      queryClient.setQueryData(
        [QueryKeys.LIST_SERIAL_NUMBERS, userId],
        (old: any) => {
          return old.filter((item: any) => item.serial_number !== serialNumber);
        },
      );
      return { previousData };
    },
    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QueryKeys.LIST_SERIAL_NUMBERS, variables.userId],
          context.previousData,
        );
      }
    },
  });

  const addSerialNumberMutation = useMutation({
    mutationFn: async ({
      userId,
      serialNumber,
    }: {
      userId: number;
      serialNumber: string;
    }) => {
      addSerialNumber({ userId, serialNumber });
    },
    onMutate: async ({ userId, serialNumber }) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.LIST_SERIAL_NUMBERS, userId],
      });

      const previousData = queryClient.getQueryData([
        QueryKeys.LIST_SERIAL_NUMBERS,
        userId,
      ]);

      queryClient.setQueryData(
        [QueryKeys.LIST_SERIAL_NUMBERS, userId],
        (old: any) => {
          return [
            ...old,
            {
              // product_id: productId,
              serial_number: serialNumber,
              user_id: userId,
            },
          ];
        },
      );

      return { previousData };
    },
    onError: (_error, variables, context) => {
      queryClient.setQueryData(
        [QueryKeys.LIST_SERIAL_NUMBERS, variables.userId],
        context?.previousData ?? [],
      );
    },
    onSettled: () => {
      form.reset({ serialNumber: "", selectedProduct: "" });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.LIST_SERIAL_NUMBERS, id],
        });
      }, 1000); // Delay of 1 second
    },
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [QueryKeys.LIST_SERIAL_NUMBERS, id],
    queryFn: getSerialNumbers,
  });

  if (isLoading) return <BeatLoader color="#123abc" loading={true} size={15} />;
  if (isError) return <span>Error: {error.message}</span>;

  const handleAddSerialNumber = (formData: FieldValues) => {
    const { serialNumber } = formData;

    addSerialNumberMutation.mutate({
      userId: id!,
      serialNumber: serialNumber,
    });
  };

  return (
    <div className="flex w-full flex-col rounded-md pb-4 lg:pr-4">
      <h4 className="self-start text-xl font-semibold text-slate-900 underline lg:text-xl">
        Product Serial Numbers
      </h4>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[240px] px-2">Product Name</TableHead> */}
            <TableHead className="px-4">Serial Number</TableHead>
            <TableHead className="pr-4 text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((serial: ProductSerialNumber) => {
            return (
              <TableRow key={serial.serial_number}>
                {/* <TableCell className="px-3 py-1 text-start">
                  {productsMap[serial.product_id].productName}
                </TableCell> */}
                <TableCell className="py-2 pl-4 text-start">
                  {serial.serial_number}
                </TableCell>
                <TableCell className="px-0 py-1 text-end">
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    className="mt-0 w-20 hover:bg-orange-100"
                    onClick={() =>
                      deleteSerialNumberMutation.mutate({
                        userId: serial.user_id,
                        serialNumber: serial.serial_number,
                      })
                    }
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="text-end">
            <TableCell className="py-1 pl-2 pr-0" colSpan={3}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddSerialNumber)}>
                  <div className="flex gap-1">
                    {/* <FormField
                      control={form.control}
                      name="selectedProduct"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger className="w-[230px] pl-2 lg:w-[230px]">
                                <SelectValue placeholder="Select Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {productsArray.map((product) => {
                                  return (
                                    <SelectItem
                                      key={product.code}
                                      value={product.code}
                                      className="pl-2"
                                    >
                                      {product.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Serial #"
                              className="w-[60px] pl-2 lg:w-[120px]"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      size={"default"}
                      type="submit"
                      variant={"outline"}
                      className="ml-auto w-20"
                      disabled={!serialNumber}
                    >
                      Add
                    </Button>
                  </div>
                </form>
              </Form>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductSerialNumberSection;
