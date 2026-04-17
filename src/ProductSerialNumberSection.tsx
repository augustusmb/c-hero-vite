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
import { strings } from "./utils/strings.ts";
import TrashIcon from "./assets/icons/icon-trash.svg?react";

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
    enabled: Boolean(id),
  });

  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const handleAddSerialNumber = (formData: FieldValues) => {
    const { serialNumber } = formData;

    addSerialNumberMutation.mutate({
      userId: id!,
      serialNumber: serialNumber,
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
      <h4 className="mb-4 text-xl font-semibold text-slate-900 lg:text-2xl">
        {strings["serial.number.section.header"]}
      </h4>
      {isLoading || !data ? (
        <div className="flex justify-center py-6">
          <BeatLoader color="#123abc" loading={true} size={15} />
        </div>
      ) : data.length === 0 ? (
        <p className="py-4 text-sm text-slate-600">
          No serial numbers added yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">
                {strings["serial.number.table.header"]}
              </TableHead>
              <TableHead className="pr-4 text-end">
                {strings["serial.number.actions"]}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((serial: ProductSerialNumber) => (
              <TableRow key={serial.serial_number}>
                <TableCell className="py-2 pl-4 text-start">
                  {serial.serial_number}
                </TableCell>
                <TableCell className="px-0 py-1 text-end">
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    aria-label={`Remove serial number ${serial.serial_number}`}
                    className="mt-0 w-14 hover:bg-orange-050"
                    onClick={() =>
                      deleteSerialNumberMutation.mutate({
                        userId: serial.user_id,
                        serialNumber: serial.serial_number,
                      })
                    }
                  >
                    <TrashIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddSerialNumber)}
          className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4"
        >
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Serial #"
                    className="w-full"
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
            className="w-20"
            disabled={!serialNumber || isLoading}
          >
            {strings["common.add"]}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductSerialNumberSection;
