const ErrorState = ({ message = "Something went wrong" }) => (
  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</div>
);

export default ErrorState;
