{
  /* <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddSerialNumber)}>
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="selectedProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px] lg:w-[240px]">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {productsArray.map((product) => {
                            return (
                              <SelectItem
                                key={product.code}
                                value={product.code}
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
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Serial Code"
                        className="w-[100px] lg:w-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button size={"default"} type="submit" className="ml-auto">
                Add
              </Button>
            </div>
          </form>
        </Form>
      </div> */
}
