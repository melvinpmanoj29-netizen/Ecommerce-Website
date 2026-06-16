function LoadingSpinner() {
  return (
    <div
      className="
      flex
      justify-center
      items-center
      py-20
      "
    >
      <div
        className="
        h-12
        w-12
        rounded-full
        border-4
        border-slate-700
        border-t-blue-500
        animate-spin
        "
      />
    </div>
  );
}

export default LoadingSpinner;