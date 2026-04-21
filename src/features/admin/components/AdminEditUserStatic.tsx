import { Pencil } from "lucide-react";
import UserInfoStatic from "../../user/components/UserInfoStatic.tsx";
import UserProductsStatic from "./UserProductsStatic.tsx";
import { UserType } from "../../../types/types.ts";
import { UserProducts } from "../../classes/types.ts";
import { strings } from "../../../utils/strings.ts";

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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 lg:text-2xl">
          {strings["account.info"]}
        </h3>
        <button
          onClick={() => toggleEditMode(!editMode)}
          aria-label="Edit user"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <UserInfoStatic userInfoToEdit={user} />
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Assigned Products
          </h4>
          <UserProductsStatic userProductData={data} />
        </div>
      </div>
    </div>
  );
};

export default AdminEditUserStatic;
