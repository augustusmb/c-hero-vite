import UserInfoStatic from "./UserInfoStatic.jsx";
import UserProductsStatic from "./UserProductsStatic.jsx";
import { UserType, UserProducts } from "./types/types.ts";
import { strings } from "./utils/strings.ts";

type AdminEditUserStaticProps = {
  toggleEditMode: (editMode: boolean) => void;
  editMode: boolean;
  userInfo: UserType;
  data: UserProducts;
};

const AdminEditUserStatic: React.FC<AdminEditUserStaticProps> = ({
  userInfo: user,
  toggleEditMode,
  editMode,
  data,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-2 flex flex-col">
        <h3 className="mb-3 self-start text-lg font-bold text-slate-900 underline lg:text-3xl">
          {strings["account.info"]}
        </h3>
        <UserInfoStatic userInfoToEdit={user} />
      </div>
      <div className="col-span-1 flex flex-col">
        <h3 className="mb-3 self-start text-lg font-bold text-slate-900 underline lg:text-3xl">
          {strings["account.assigned.products"]}
        </h3>
        <UserProductsStatic userProductData={data} />
      </div>
      <div className="col-span-2 mt-3 flex items-start lg:mt-0">
        <button
          disabled
          className="h-9 w-24 rounded border border-slate-500 bg-slate-050 font-semibold text-slate-950 
hover:border-transparent hover:bg-slate-600 hover:text-slate-050
disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-50 
disabled:hover:border-slate-500 disabled:hover:bg-slate-200 disabled:hover:text-slate-500"
          onClick={() => toggleEditMode(!editMode)}
        >
          {strings["common.edit"]}
        </button>
      </div>
    </div>
  );
};

export default AdminEditUserStatic;
