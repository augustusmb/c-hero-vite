import { useQuery, useMutation } from "@tanstack/react-query";
import SignUpForm from "./SignUpForm";
import { QueryKeys } from "../../utils/QueryKeys";
import { fetchOptions, signUpUser } from "../../api/signUp";
import { TSignUpSchema } from "./SignUpConfig";

type TSelect = {
  name: string;
  id: number;
};

type SignUpPageProps = {
  setActiveTab: (tab: string) => void;
};

const SignUpPage = ({ setActiveTab }: SignUpPageProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.FORM_OPTIONS],
    queryFn: fetchOptions,
  });

  const signUpUserMutation = useMutation({
    mutationFn: async (signUpUserData: TSignUpSchema) => {
      signUpUser(signUpUserData);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading form options</div>;
  if (!data) return <div>No data available</div>;

  const companies = data.data.companies.map((company: TSelect) => ({
    value: company.id,
    label: company.name,
  }));
  const ports = data.data.ports.map((port: TSelect) => ({
    value: port.id,
    label: port.name,
  }));
  const vessels = data.data.vessels.map((vessel: TSelect) => ({
    value: vessel.id,
    label: vessel.name,
  }));

  return (
    <SignUpForm
      companies={companies}
      setActiveTab={setActiveTab}
      ports={ports}
      vessels={vessels}
      signUpUserMutation={signUpUserMutation.mutate}
    />
  );
};

export default SignUpPage;
