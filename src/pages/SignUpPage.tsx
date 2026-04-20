import { useQuery, useMutation } from "@tanstack/react-query";
import SignUpForm from "../features/signup/components/SignUpForm";
import { signUpFormOptionsQuery } from "../features/signup/queries";
import { signUpUser } from "../api/signUp";

const SignUpPage = () => {
  const { data, isLoading, error } = useQuery(signUpFormOptionsQuery());

  const signUpUserMutation = useMutation({ mutationFn: signUpUser });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading form options</div>;
  if (!data) return <div>No data available</div>;

  const companies = data.companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));
  const ports = data.ports.map((port) => ({
    value: port.id,
    label: port.name,
  }));
  const vessels = data.vessels.map((vessel) => ({
    value: vessel.id,
    label: vessel.name,
  }));

  return (
    <SignUpForm
      companies={companies}
      ports={ports}
      vessels={vessels}
      signUpUserMutation={signUpUserMutation.mutateAsync}
    />
  );
};

export default SignUpPage;
