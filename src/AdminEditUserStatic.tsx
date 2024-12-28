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
          className="w-24 rounded border border-slate-500 bg-slate-050 px-3 py-1 font-semibold text-slate-950 hover:border-transparent hover:bg-slate-600 hover:text-slate-050 lg:w-36 lg:self-center"
          onClick={() => toggleEditMode(!editMode)}
        >
          {strings["common.edit"]}
        </button>
      </div>
    </div>
  );
};

export default AdminEditUserStatic;
