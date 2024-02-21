import CheckIcon from "../assets/icons/icon-check.svg?react";

const TestInfoInput = () => {
  return (
    <div className="mb-10 flex list-inside list-disc flex-col text-left">
      <div className="flex">
        <CheckIcon className="h-6 w-6 fill-orange-050 stroke-orange-600" />
        The test is open book
      </div>
      <div className="flex">
        <CheckIcon className="h-6 w-6 fill-orange-050 stroke-orange-600" />
        All test questions must be answered correctly to pass the test
      </div>
    </div>
  );
};

export default TestInfoInput;
